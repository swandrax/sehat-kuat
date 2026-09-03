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
      email: "hendra.pratama@kliniksehat.id",
      specialization: "Spesialis Penyakit Dalam",
      strNumber: "STR-3171-8892-2024",
      sipNumber: "SIP-DKI-2024-00189",
      experienceYears: 8,
      clinic: "KlinikSehat Cabang Pusat",
      status: "PENDING",
      submittedAt: "Hari ini, 09:15",
    },
    {
      id: "doc-app-2",
      name: "dr. Amanda Kartika, Sp.A",
      email: "amanda.kartika@kliniksehat.id",
      specialization: "Spesialis Anak",
      strNumber: "STR-3273-5519-2023",
      sipNumber: "SIP-BDG-2023-00912",
      experienceYears: 5,
      clinic: "KlinikSehat Cabang Selatan",
      status: "PENDING",
      submittedAt: "Kemarin, 14:00",
    },
    {
      id: "doc-app-3",
      name: "dr. Budi Setiawan, Sp.JP",
      email: "budi.setiawan@kliniksehat.id",
      specialization: "Spesialis Jantung & Pembuluh Darah",
      strNumber: "STR-3171-1120-2022",
      sipNumber: "SIP-DKI-2022-00455",
      experienceYears: 12,
      clinic: "KlinikSehat Cabang Pusat",
      status: "APPROVED",
      submittedAt: "10 Ags 2024",
    },
  ]);

  const handleApprove = (id: string, name: string) => {
    setDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, status: "APPROVED" } : doc)),
    );
    toast.success(`Akun ${name} telah berhasil diverifikasi dan diaktifkan!`);
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
    <div className="p-4 space-y-5 pb-28 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Verifikasi Dokter</h1>
          <p className="text-xs text-gray-500">Validasi Kredensial STR & SIP Praktik</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-200/70 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "PENDING"
              ? "bg-white text-amber-900 shadow-sm"
              : "text-gray-600"
          }`}
        >
          Menunggu Verifikasi ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("APPROVED")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "APPROVED"
              ? "bg-white text-emerald-900 shadow-sm"
              : "text-gray-600"
          }`}
        >
          Telah Disetujui
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Cari nama, spesialisasi, atau nomor STR..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-primary-500 focus:outline-hidden shadow-xs"
        />
      </div>

      {/* Doctor Cards List */}
      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-6 space-y-2">
          <FileCheck className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-xs font-bold text-gray-700">Tidak ada data dokter</p>
          <p className="text-[11px] text-gray-500">
            {activeTab === "PENDING"
              ? "Semua pendaftaran dokter telah selesai diproses."
              : "Belum ada dokter yang terdaftar dalam kategori ini."}
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-xs p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{doc.name}</h3>
                    <p className="text-xs text-primary-600 font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-gray-400">{doc.clinic}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    doc.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {doc.status === "APPROVED" ? "Aktif" : "Review"}
                </span>
              </div>

              {/* Credential Data Grid */}
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-400 font-medium">No. STR:</span>
                  <p className="font-mono font-bold text-gray-800">{doc.strNumber}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">No. SIP Praktik:</span>
                  <p className="font-mono font-bold text-gray-800">{doc.sipNumber}</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Pengalaman Klinis:</span>
                  <p className="font-semibold text-gray-800">{doc.experienceYears} Tahun</p>
                </div>
                <div>
                  <span className="text-gray-400 font-medium">Email Kontak:</span>
                  <p className="font-semibold text-gray-800 truncate">{doc.email}</p>
                </div>
              </div>

              {/* Action Buttons for Pending */}
              {doc.status === "PENDING" && (
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <button
                    onClick={() => handleReject(doc.id, doc.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Tolak
                  </button>
                  <button
                    onClick={() => handleApprove(doc.id, doc.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Setujui & Aktifkan
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
