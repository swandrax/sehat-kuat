"use client";

import { ArrowLeft, FileText, Calendar, ShieldCheck, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MedicalRecordsPage() {
  const router = useRouter();

  // Mock data for Medical Records
  const mockRecords = [
    {
      id: "REC-001",
      date: "12 Ags 2024",
      doctor: "dr. Andi Setiawan, Sp.PD",
      clinic: "KlinikSehat Pusat",
      diagnosis: "Gejala Tifus Ringan",
      notes: "Pasien disarankan istirahat total selama 3 hari dan mengonsumsi antibiotik sesuai resep. Perbanyak minum air putih.",
    },
    {
      id: "REC-002",
      date: "05 Jun 2024",
      doctor: "dr. Budi Santoso, Sp.A",
      clinic: "KlinikSehat Cabang Selatan",
      diagnosis: "Influenza & Radang Tenggorokan",
      notes: "Diberikan obat penurun panas dan pereda radang. Jika dalam 3 hari tidak membaik, segera kembali.",
    }
  ];

  return (
    <div className="p-4 space-y-5 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Rekam Medis</h1>
          <p className="text-xs text-gray-500">Riwayat kesehatan Anda</p>
        </div>
      </div>

      <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 p-2 rounded-xl text-primary-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary-900">Data Aman & Terenkripsi</h3>
            <p className="text-[10px] text-primary-700">Hanya Anda dan dokter yang berwenang yang dapat melihat</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockRecords.map((record) => (
          <div key={record.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <Calendar className="w-4 h-4 text-primary-500" />
                {record.date}
              </div>
              <span className="text-[10px] font-bold text-gray-400">#{record.id}</span>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{record.diagnosis}</h3>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-primary-600 font-medium">
                  <Stethoscope className="w-3.5 h-3.5" /> {record.doctor}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{record.clinic}</p>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-700">Catatan Dokter:</span> {record.notes}
                </p>
              </div>

              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-primary-100 text-primary-600 rounded-xl font-bold text-xs hover:bg-primary-50 transition">
                <FileText className="w-4 h-4" /> Lihat Detail Dokumen
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
