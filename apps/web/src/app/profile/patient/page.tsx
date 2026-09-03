"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  User,
  ShieldCheck,
  X,
  LogOut,
  Lock,
  Key,
  Users,
  MessageSquare,
  CreditCard,
  Info,
  FileText,
  PhoneCall,
  Activity,
  HeartPulse,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { ZavoraLogo } from "@/components/common/ZavoraLogo";

export default function PatientProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [showInsuranceBanner, setShowInsuranceBanner] = useState(true);

  const userName = user?.name || "Swandaru Tirta Sandhika";
  const userPhone = user?.phone || "0877-8238-0077";
  const userEmail = user?.email || "pasien@zavoralife.id";

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-900">Pengaturan Profil</h1>
            <p className="text-xs text-slate-500">Kelola akun dan preferensi medis Anda</p>
          </div>
        </div>

        <div className="hidden sm:block">
          <ZavoraLogo size="sm" showTagline={false} />
        </div>
      </div>

      {/* User Info Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600 border-2 border-emerald-400 text-white shadow-md flex items-center justify-center font-black text-2xl shrink-0">
          {userName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-slate-900 leading-tight truncate">{userName}</h2>
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{userPhone}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">{userEmail}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Section 1: Akun */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Akun & Keamanan</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <ProfileMenuItem icon={<User className="w-4 h-4 text-slate-500" />} label="Profil & Data Medis" />
            <ProfileMenuItem icon={<Users className="w-4 h-4 text-slate-500" />} label="Anggota Keluarga Terdaftar" />
            <ProfileMenuItem icon={<Lock className="w-4 h-4 text-slate-500" />} label="Ubah Kata Sandi" />
            <ProfileMenuItem icon={<Key className="w-4 h-4 text-slate-500" />} label="PIN Transaksi Zavora Life" />
          </div>
        </div>

        {/* Section 2: Sambungkan Asuransi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Klaim Asuransi Mitra</h3>
          </div>

          {showInsuranceBanner && (
            <div className="bg-emerald-700 text-white p-4 flex items-start justify-between gap-3 text-xs">
              <span className="font-medium leading-snug">
                Sambungkan kartu asuransi kesehatan Anda untuk fasilitas cashless di seluruh jaringan Zavora Life.
              </span>
              <button
                onClick={() => setShowInsuranceBanner(false)}
                className="text-white/80 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="divide-y divide-slate-100">
            <ProfileMenuItem icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />} label="Zavora Life Protection Corporate" />
            <ProfileMenuItem icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />} label="Admedika Healthcare" />
            <ProfileMenuItem icon={<ShieldCheck className="w-4 h-4 text-emerald-600" />} label="Fullerton Health Indonesia" />
          </div>
        </div>

        {/* Section 3: Informasi Aplikasi */}
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Aplikasi Zavora Life</h3>
          </div>
          <div className="divide-y divide-slate-100">
            <ProfileMenuItem icon={<Info className="w-4 h-4 text-slate-500" />} label="Tentang Zavora Life" />
            <ProfileMenuItem icon={<Lock className="w-4 h-4 text-slate-500" />} label="Kebijakan Privasi Rekam Medis" />
            <ProfileMenuItem icon={<FileText className="w-4 h-4 text-slate-500" />} label="Syarat & Ketentuan Layanan" />
            <ProfileMenuItem icon={<PhoneCall className="w-4 h-4 text-slate-500" />} label="Hubungi Bantuan Pasien" />
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full bg-white border border-slate-200 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold p-4 rounded-2xl flex items-center justify-between transition shadow-xs"
        >
          <span className="text-xs">Keluar dari Akun</span>
          <LogOut className="w-4 h-4 text-rose-500" />
        </button>

        {/* Footer Version */}
        <div className="text-center pt-2 text-[10px] text-slate-400 font-mono">
          Zavora Life Platform • v1.0.0
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function ProfileMenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-semibold text-slate-800">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </div>
  );
}
