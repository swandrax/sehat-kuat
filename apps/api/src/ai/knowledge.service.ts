import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface DiseaseRecord {
  name: string;
  description: string;
  causes: string;
  symptoms: string;
}

export interface MedicineRecord {
  name: string;
  description: string;
  warnings: string;
  dosage: string;
  sideEffects: string;
  diseases: string;
}

@Injectable()
export class KnowledgeService implements OnModuleInit {
  private readonly logger = new Logger(KnowledgeService.name);
  private diseases: DiseaseRecord[] = [];
  private medicines: MedicineRecord[] = [];

  onModuleInit() {
    this.loadDatasets();
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  }

  loadDatasets() {
    const csvDir = path.resolve(process.cwd(), '../../csv-data');

    // 1. Load Penyakit
    const penyakitPath = path.join(csvDir, 'processed_data_penyakit.csv');
    if (fs.existsSync(penyakitPath)) {
      try {
        const content = fs.readFileSync(penyakitPath, 'utf-8');
        const lines = content.split('\n');
        const list: DiseaseRecord[] = [];

        // Header: Nama Penyakit,Deskripsi Penyakit,Penyebab Penyakit,Gejala Penyakit
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = this.parseCSVLine(l);
          if (cols.length >= 4) {
            list.push({
              name: cols[0],
              description: cols[1],
              causes: cols[2],
              symptoms: cols[3],
            });
          }
        }
        this.diseases = list;
        this.logger.log(`Loaded ${this.diseases.length} disease records from CSV.`);
      } catch (err) {
        this.logger.error(`Error loading penyakit CSV: ${err}`);
      }
    }

    // 2. Load Obat
    const obatPath = path.join(csvDir, 'processed_data_obat.csv');
    if (fs.existsSync(obatPath)) {
      try {
        const content = fs.readFileSync(obatPath, 'utf-8');
        const lines = content.split('\n');
        const list: MedicineRecord[] = [];

        // Header: Nama Obat,Deskripsi Obat,Peringatan Sebelum Mengonsumsi Obat,Dosis dan Aturan Pakai Obat,Efek Samping dan Bahaya Obat,Penyakit sesuai dengan obat
        for (let i = 1; i < lines.length; i++) {
          const l = lines[i].trim();
          if (!l) continue;
          const cols = this.parseCSVLine(l);
          if (cols.length >= 6) {
            list.push({
              name: cols[0],
              description: cols[1],
              warnings: cols[2],
              dosage: cols[3],
              sideEffects: cols[4],
              diseases: cols[5],
            });
          }
        }
        this.medicines = list;
        this.logger.log(`Loaded ${this.medicines.length} medicine records from CSV.`);
      } catch (err) {
        this.logger.error(`Error loading obat CSV: ${err}`);
      }
    }
  }

  searchDiseases(query: string, limit = 10): DiseaseRecord[] {
    if (!query || !query.trim()) {
      return this.diseases.slice(0, limit);
    }
    const q = query.toLowerCase();
    const scored = this.diseases
      .map((d) => {
        let score = 0;
        if (d.name.toLowerCase().includes(q)) score += 10;
        if (d.symptoms.toLowerCase().includes(q)) score += 5;
        if (d.description.toLowerCase().includes(q)) score += 2;
        return { item: d, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.item);
  }

  searchMedicines(query: string, limit = 10): MedicineRecord[] {
    if (!query || !query.trim()) {
      return this.medicines.slice(0, limit);
    }
    const q = query.toLowerCase();
    const scored = this.medicines
      .map((m) => {
        let score = 0;
        if (m.name.toLowerCase().includes(q)) score += 10;
        if (m.diseases.toLowerCase().includes(q)) score += 6;
        if (m.description.toLowerCase().includes(q)) score += 3;
        return { item: m, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.item);
  }

  getRAGContext(prompt: string): string {
    const matchedDiseases = this.searchDiseases(prompt, 2);
    const matchedMedicines = this.searchMedicines(prompt, 2);

    let context = '';
    if (matchedDiseases.length > 0) {
      context += '\n[Informasi Penyakit Terkait]\n';
      matchedDiseases.forEach((d) => {
        context += `- ${d.name}: ${d.description.slice(0, 180)}...\n  Gejala: ${d.symptoms.slice(0, 150)}\n`;
      });
    }

    if (matchedMedicines.length > 0) {
      context += '\n[Informasi Farmakologi Terkait]\n';
      matchedMedicines.forEach((m) => {
        context += `- ${m.name}: Indikasi untuk ${m.diseases}. Dosis umum: ${m.dosage.slice(0, 120)}...\n`;
      });
    }

    return context;
  }
}
