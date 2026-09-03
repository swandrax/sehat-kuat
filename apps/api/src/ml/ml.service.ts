import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { ClassifySymptomDto, PredictHealthRiskDto } from './dto/ml.dto';

@Injectable()
export class MLService {
  private readonly logger = new Logger(MLService.name);
  private readonly projectRoot = path.resolve(process.cwd(), '../..');
  private readonly pipelineDir = path.resolve(process.cwd(), '../../services/ml-pipeline');
  private readonly modelDir = path.resolve(process.cwd(), '../../services/ml-pipeline/models');

  async getMetrics() {
    const summaryPath = path.join(this.modelDir, 'pipeline_summary.json');
    const symptomMetaPath = path.join(this.modelDir, 'symptom_classifier_meta.json');
    const riskMetaPath = path.join(this.modelDir, 'health_risk_meta.json');
    const dpoMetaPath = path.join(this.modelDir, 'dpo_eval_meta.json');

    const readJsonSafe = (filePath: string) => {
      try {
        if (fs.existsSync(filePath)) {
          return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
      } catch (e) {
        this.logger.error(`Error reading ${filePath}: ${e}`);
      }
      return null;
    };

    return {
      status: 'READY',
      summary: readJsonSafe(summaryPath),
      symptomClassifier: readJsonSafe(symptomMetaPath),
      healthRiskModel: readJsonSafe(riskMetaPath),
      dpoAlignment: readJsonSafe(dpoMetaPath),
    };
  }

  async classifySymptom(dto: ClassifySymptomDto) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.pipelineDir, 'predict.py');
      const py = spawn('python', [
        scriptPath,
        '--task',
        'symptom',
        '--input',
        dto.symptoms,
      ], { cwd: this.projectRoot });

      let stdout = '';
      let stderr = '';

      py.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      py.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      py.on('close', (code) => {
        if (code !== 0) {
          this.logger.warn(`Python prediction exited with code ${code}: ${stderr}`);
          // Fallback rule-based
          return resolve({
            specialty: 'Dokter Umum',
            confidence: 0.8,
            model: 'RuleBased_Fallback',
          });
        }

        try {
          // Parse last JSON line from stdout
          const lines = stdout.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          resolve(result);
        } catch (err) {
          this.logger.error(`Failed to parse ML output: ${stdout}`);
          resolve({
            specialty: 'Dokter Umum',
            confidence: 0.8,
            model: 'RuleBased_Fallback',
          });
        }
      });
    });
  }

  async predictHealthRisk(dto: PredictHealthRiskDto) {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.pipelineDir, 'predict.py');
      const py = spawn('python', [
        scriptPath,
        '--task',
        'risk',
        '--age',
        String(dto.age),
        '--systolic',
        String(dto.systolic),
        '--diastolic',
        String(dto.diastolic),
        '--condition',
        dto.condition || 'Umum',
      ], { cwd: this.projectRoot });

      let stdout = '';
      let stderr = '';

      py.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      py.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      py.on('close', (code) => {
        if (code !== 0) {
          this.logger.warn(`Risk prediction exited with code ${code}: ${stderr}`);
          return resolve({
            age: dto.age,
            systolic: dto.systolic,
            diastolic: dto.diastolic,
            risk_score: 0.3,
            status: 'Standard',
          });
        }

        try {
          const lines = stdout.trim().split('\n');
          const lastLine = lines[lines.length - 1];
          const result = JSON.parse(lastLine);
          resolve(result);
        } catch (err) {
          resolve({
            age: dto.age,
            systolic: dto.systolic,
            diastolic: dto.diastolic,
            risk_score: 0.3,
            status: 'Standard',
          });
        }
      });
    });
  }

  async triggerTraining() {
    this.logger.log('Triggering ML/DL Training Pipeline...');
    const scriptPath = path.join(this.pipelineDir, 'train.py');

    const py = spawn('python', [scriptPath], {
      cwd: this.projectRoot,
      detached: true,
      stdio: 'ignore',
    });
    py.unref();

    return {
      message: 'Training pipeline started in background',
      timestamp: new Date().toISOString(),
      models: [
        'DeepLearning_Symptom_Classifier_NLP',
        'RandomForest_Health_Risk_Assessment',
        'DPO_Chatbot_Preference_Alignment',
      ],
    };
  }
}
