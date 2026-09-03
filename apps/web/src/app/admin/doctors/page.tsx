"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  ShieldAlert,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DoctorApplicant {
  id: string;
  name: string;
  email: string;
  specialization: string;
  strNumber: string;
  sipNumber: string;
  experienceYears: number;
  clinic: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  submittedAt: string;
}

export default function AdminDoctorVerificationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED">("PENDING");
  const [search, setSearch] = useState("");

  const [doctors, setDoctors] = useState<DoctorApplicant[]>([
    {
      id: "doc-app-1",
      name: "dr. Hendra Pratama, Sp.PD",
      email: "hendra.pratama@zavoralife.id",
      specialization: "Spesialis Penyakit Dalam",
      strNumber: "STR-3171-8892-2024",
      sipNumber: "SIP-DKI-2024-00189",
      experienceYears: 8,
      clinic: "Klinik Zavora Life Pusat",
      status: "PENDING",
      submittedAt: "Hari ini, 09:15",
    },
    {
      id: "doc-app-2",
      name: "dr. Amanda Kartika, Sp.A",
      email: "amanda.kartika@zavoralife.id",
      specialization: "Spesialis Anak",
      strNumber: "STR-3273-5519-2023",
      sipNumber: "SIP-BDG-2023-00912",
      experienceYears: 5,
      clinic: "Klinik Zavora Life Cabang Selatan",
      status: "PENDING",
      submittedAt: "Kemarin, 14:00",
    },
    {
      id: "doc-app-3",
      name: "dr. Budi Setiawan, Sp.JP",
      email: "budi.setiawan@zavoralife.id",
      specialization: "Spesialis Jantung & Pembuluh Darah",
      strNumber: "STR-3171-1120-2022",
      sipNumber: "SIP-DKI-2022-00455",
      experienceYears: 12,
      clinic: "Klinik Zavora Life Pusat",
      status: "APPROVED",
      submittedAt: "10 Ags 2024",
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: "APPROVED" } : doc)),
    );
    toast.success(`Akun ${name} telah berhasil diverifikasi dan diaktifkan di jaringan Zavora Life!`);
  };

  const handleReject = (id: string, name: string) => {
    if (!confirm(`Yakin ingin menolak pendaftaran dokter ${name}?`)) return;
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: "REJECTED" } : doc)),
    );
    toast.info(`Pendaftaran dokter ${name} ditolak.`);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchTab = doc.status === activeTab;
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.strNumber.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const pendingCount = doctors.filter((d) => d.status === "PENDING").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-2xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Verifikasi Dokter Spesialis</h1>
          <p className="text-xs text-slate-500">Validasi Kredensial STR & SIP Praktik Resmi Zavora Life</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "PENDING"
              ? "bg-white text-emerald-950 shadow-2xs"
              : "text-slate-600"
          }`}
        >
          Menunggu Verifikasi ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "APPROVED"
              ? "bg-white text-emerald-950 shadow-2xs"
              : "text-slate-600"
          }`}
        >
          Telah Disetujui
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Cari nama, spesialisasi, atau nomor STR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden shadow-2xs font-medium"
        />
      </div>

      {/* Doctor Cards List */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-2">
          <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-700">Tidak ada data dokter</p>
          <p className="text-[11px] text-slate-500">
            {activeTab === "PENDING"
              ? "Semua pendaftaran dokter telah selesai diproses."
              : "Belum ada dokter yang terdaftar dalam kategori ini."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-5 space-y-4 hover:border-emerald-300 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{doc.clinic}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                    doc.status === "APPROVED"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {doc.status === "APPROVED" ? "Aktif Terverifikasi" : "Menunggu Review"}
                </span>
              </div>

              {/* Credential Data Grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] font-medium block">No. STR:</span>
                  <p className="font-mono font-bold text-slate-800 text-[11px]">{doc.strNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-medium block">No. SIP Praktik:</span>
                  <p className="font-mono font-bold text-slate-800 text-[11px]">{doc.sipNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-medium block">Pengalaman Klinis:</span>
                  <p className="font-semibold text-slate-800 text-[11px]">{doc.experienceYears} Tahun</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-medium block">Email Kontak:</span>
                  <p className="font-semibold text-slate-800 text-[11px] truncate">{doc.email}</p>
                </div>
              </div>

              {/* Action Buttons for Pending */}
              {doc.status === "PENDING" && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleReject(doc.id, doc.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Tolak
                  </button>
                  <button
                    onClick={() => handleApprove(doc.id, doc.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Setujui & Aktifkan Dokter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
