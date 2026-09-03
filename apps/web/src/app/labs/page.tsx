"use client";

import { ArrowLeft, Activity, FileText, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

export default function LabResultsPage() {
  const router = useRouter();

  const mockLabs = [
    {
      id: "LAB-992",
      testName: "Pemeriksaan Darah Lengkap (Hematologi)",
      date: "14 Ags 2024",
      status: "Selesai",
      clinic: "Laboratorium Zavora Life Pusat",
    },
    {
      id: "LAB-993",
      testName: "Tes Kolesterol & Gula Darah Puasa",
      date: "01 Sep 2024",
      status: "Menunggu Hasil",
      clinic: "Laboratorium Zavora Life Selatan",
    },
  ];

  const handleDownload = (id: string) => {
    toast.success(`Dokumen hasil lab ${id} sedang diunduh (PDF)`);
  };

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
          <h1 className="text-lg font-bold text-slate-900">Hasil Laboratorium</h1>
          <p className="text-xs text-slate-500">Dokumen rekam tes lab & diagnostik Zavora Life</p>
        </div>
      </div>

      <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2.5 rounded-2xl text-emerald-800">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-emerald-950">Analisis Lab dengan AI</h3>
            <p className="text-[11px] text-emerald-800">Tanyakan interpretasi angka lab Anda ke Asisten AI</p>
          </div>
        </div>
        <Link
          href="/ai-screening"
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs"
        >
          Tanya AI
        </Link>
      </div>

      <div className="space-y-4">
        {mockLabs.map((lab) => (
          <div key={lab.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-[10px] font-mono font-bold text-slate-400">#{lab.id}</span>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  lab.status === "Selesai"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                {lab.status === "Selesai" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                {lab.status}
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">{lab.testName}</h3>
                <p className="text-xs text-emerald-700 font-semibold mt-1">{lab.clinic}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tanggal Pemeriksaan: {lab.date}</p>
              </div>

              <button
                disabled={lab.status !== "Selesai"}
                onClick={() => handleDownload(lab.id)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
                  lab.status === "Selesai"
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs active:scale-95"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
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
