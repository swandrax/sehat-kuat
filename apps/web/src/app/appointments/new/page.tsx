"use client";

import { ArrowLeft, Search, Calendar, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewAppointmentPage() {
  const router = useRouter();

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Buat Janji Temu</h1>
          <p className="text-xs text-gray-500">Pilih dokter untuk konsultasi</p>
        </div>
      </div>

      {/* Guide / Alert */}
      <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex gap-3 items-start">
        <Calendar className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-primary-800">Bagaimana Cara Membuat Janji?</h3>
          <p className="text-xs text-primary-600 mt-1">
            Silakan cari dan pilih dokter spesialis yang sesuai dengan keluhan Anda terlebih dahulu. Setelah itu Anda bisa memilih jadwal praktik yang tersedia.
          </p>
        </div>
      </div>

      {/* Quick Search Doctors */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-800">Cari Berdasarkan Spesialisasi</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <SpecialtyCard label="Dokter Umum" icon="👨‍⚕️" href="/doctors" />
          <SpecialtyCard label="Penyakit Dalam" icon="🫀" href="/doctors" />
          <SpecialtyCard label="Spesialis Anak" icon="👶" href="/doctors" />
          <SpecialtyCard label="Dokter Gigi" icon="🦷" href="/doctors" />
          <SpecialtyCard label="Kandungan" icon="🤰" href="/doctors" />
          <SpecialtyCard label="Spesialis Kulit" icon="✨" href="/doctors" />
        </div>

        <Link href="/doctors" className="flex items-center justify-center w-full py-3.5 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition mt-4">
          <Search className="w-4 h-4 mr-2" /> Cari Semua Dokter
        </Link>
      </div>

      {/* Mock Past Appointments */}
      <div>
        <h2 className="text-sm font-bold text-gray-800 mb-3 ml-1">Janji Temu Terakhir</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <Stethoscope className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-600">Belum Ada Riwayat</p>
          <p className="text-xs text-gray-400 mt-1">Anda belum pernah membuat janji temu sebelumnya.</p>
        </div>
      </div>
    </div>
  );
}

function SpecialtyCard({ label, icon, href }: { label: string, icon: string, href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:border-primary-200 hover:bg-primary-50 transition group">
      <div className="text-xl">{icon}</div>
      <span className="text-xs font-semibold text-gray-700 group-hover:text-primary-700">{label}</span>
    </Link>
  );
}
