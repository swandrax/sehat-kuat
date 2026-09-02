"use client";

import { ArrowLeft, Activity, FileText, CheckCircle2, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LabResultsPage() {
  const router = useRouter();

  const mockLabs = [
    {
      id: "LAB-992",
      testName: "Pemeriksaan Darah Lengkap (Hematologi)",
      date: "14 Ags 2024",
      status: "Selesai",
      clinic: "Laboratorium KlinikSehat Pusat",
    },
    {
      id: "LAB-993",
      testName: "Tes Kolesterol & Gula Darah Puasa",
      date: "01 Sep 2024",
      status: "Menunggu Hasil",
      clinic: "Laboratorium KlinikSehat Selatan",
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
          <h1 className="text-lg font-bold text-gray-900">Hasil Laboratorium</h1>
          <p className="text-xs text-gray-500">Pantau dokumen lab Anda</p>
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-xl text-red-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-900">Konsultasikan Hasil</h3>
            <p className="text-[10px] text-red-700">Gunakan AI Screening untuk membaca hasil lab</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <span className="text-[10px] font-bold text-gray-400">#{lab.id}</span>
              <div className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${lab.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {lab.status === "Selesai" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {lab.status}
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">{lab.testName}</h3>
                <p className="text-xs text-gray-500 mt-1">{lab.clinic}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Tgl Pemeriksaan: {lab.date}</p>
              </div>

              <button 
                disabled={lab.status !== "Selesai"}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
                  lab.status === "Selesai" 
                    ? "bg-primary-600 text-white hover:bg-primary-700 shadow-sm" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <FileText className="w-4 h-4" /> Unduh Dokumen PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
