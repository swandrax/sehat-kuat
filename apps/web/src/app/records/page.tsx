"use client";

import { ArrowLeft, FileText, Calendar, ShieldCheck, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function MedicalRecordsPage() {
  const router = useRouter();

  const mockRecords = [
    {
      id: "REC-001",
      date: "12 Ags 2024",
      doctor: "dr. Andi Setiawan, Sp.PD",
      clinic: "Klinik Zavora Life Pusat",
      diagnosis: "Dispepsia Fungsional & Gastritis",
      notes: "Pasien dianjurkan menjaga pola makan teratur, hindari makanan pedas & kafein tinggi. Terapi antasida & PPI dilanjutkan selama 5 hari.",
    },
    {
      id: "REC-002",
      date: "05 Jun 2024",
      doctor: "dr. Amanda Kartika, Sp.A",
      clinic: "Klinik Zavora Life Cabang Selatan",
      diagnosis: "Infeksi Saluran Pernapasan Akut (ISPA)",
      notes: "Edukasi hidrasi 2 liter/hari dan istirahat optimal. Resep antipiretik dan mukolitik selesai.",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-2xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Rekam Medis Elektronik (EMR)</h1>
          <p className="text-xs text-slate-500">Riwayat diagnosis dan tindakan klinis Zavora Life</p>
        </div>
      </div>

      <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-950">Data Aman & Terenkripsi</h3>
            <p className="text-[11px] text-emerald-800">
              Dilindungi enkripsi data standar privasi medis Zavora Life
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                <Calendar className="w-4 h-4 text-emerald-600" />
                {record.date}
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">#{record.id}</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{record.diagnosis}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-emerald-700 font-semibold">
                  <Stethoscope className="w-3.5 h-3.5" /> {record.doctor}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{record.clinic}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-900">Catatan Klinis:</span> {record.notes}
                </p>
              </div>

              <button
                onClick={() => toast.success(`Membuka rincian rekam medis #${record.id}`)}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 rounded-xl font-bold text-xs transition shadow-2xs"
              >
                <FileText className="w-4 h-4 text-emerald-600" /> Lihat Resume Medis Lengkap
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
