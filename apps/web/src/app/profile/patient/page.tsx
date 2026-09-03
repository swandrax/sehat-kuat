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
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";

export default function PatientProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [showInsuranceBanner, setShowInsuranceBanner] = useState(true);

  const userName = user?.name || "Swandaru Tirta Sandhika";
  const userPhone = user?.phone || "0877-8238-0077";

  return (
    <div className="min-h-screen bg-gray-100 pb-28 max-w-md mx-auto relative font-sans">
      {/* Top Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200 flex items-center gap-4 sticky top-0 z-20 shadow-2xs">
        <button
          onClick={() => router.back()}
          className="text-gray-700 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Profil</h1>
      </div>

      {/* User Info Header Card */}
      <div className="bg-white p-5 flex items-center gap-4 border-b border-gray-200">
        <div className="w-16 h-16 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-2xl shrink-0 overflow-hidden">
          S
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900 leading-tight">{userName}</h2>
          <p className="text-xs text-gray-500 font-medium mt-1">{userPhone}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Section 1: Akun */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-700">Akun</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <ProfileMenuItem icon={<User className="w-4 h-4 text-gray-500" />} label="Profil Saya" />
            <ProfileMenuItem icon={<Users className="w-4 h-4 text-gray-500" />} label="Keluarga Saya" />
            <ProfileMenuItem icon={<MessageSquare className="w-4 h-4 text-gray-500" />} label="Topik Saya" />
            <ProfileMenuItem icon={<Lock className="w-4 h-4 text-gray-500" />} label="Ubah Kata Sandi" />
            <ProfileMenuItem icon={<Key className="w-4 h-4 text-gray-500" />} label="Ubah PIN KlinikSehat" />
          </div>
        </div>

        {/* Section 2: Sambungkan Asuransi */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-700">Sambungkan Asuransi</h3>
          </div>

          {/* Insurance Banner */}
          {showInsuranceBanner && (
            <div className="bg-blue-600 text-white p-3.5 flex items-start justify-between gap-2 text-xs">
              <span className="font-medium leading-tight">
                Pilih dan sambungkan asuransi Anda dengan KlinikSehat di sini.
              </span>
              <button
                onClick={() => setShowInsuranceBanner(false)}
                className="text-white/80 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="divide-y divide-gray-100">
            <ProfileMenuItem icon={<ShieldCheck className="w-4 h-4 text-blue-600" />} label="KlinikSehat Proteksi Corporate" />
            <ProfileMenuItem icon={<ShieldCheck className="w-4 h-4 text-blue-600" />} label="Admedika" />
            <ProfileMenuItem icon={<ShieldCheck className="w-4 h-4 text-blue-600" />} label="Fullerton" />
          </div>
        </div>

        {/* Section 3: Aktivitas Saya */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-700">Aktivitas Saya</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <ProfileMenuItem icon={<CreditCard className="w-4 h-4 text-gray-500" />} label="Transaksi Saya" />
          </div>
        </div>

        {/* Section 4: Aplikasi KlinikSehat */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-700">Aplikasi KlinikSehat</h3>
          </div>
          <div className="divide-y divide-gray-100">
            <ProfileMenuItem icon={<Info className="w-4 h-4 text-gray-500" />} label="Tentang Kami" />
            <ProfileMenuItem icon={<Lock className="w-4 h-4 text-gray-500" />} label="Privasi" />
            <ProfileMenuItem icon={<FileText className="w-4 h-4 text-gray-500" />} label="Syarat & Ketentuan" />
            <ProfileMenuItem icon={<PhoneCall className="w-4 h-4 text-gray-500" />} label="Hubungi Kami" />
          </div>
        </div>

        {/* Section 5: Keluar Button */}
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="w-full bg-white border border-gray-200 text-gray-800 font-bold p-4 rounded-2xl flex items-center justify-between hover:bg-red-50 hover:text-red-600 transition shadow-2xs"
        >
          <span className="text-sm">Keluar</span>
          <LogOut className="w-5 h-5 text-gray-500" />
        </button>

        {/* Footer Version */}
        <div className="text-center pt-2 text-[11px] text-gray-400 font-medium">
          Versi 8.8.2 - 162
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function ProfileMenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-between p-3.5 hover:bg-gray-50 cursor-pointer transition">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-xs font-semibold text-gray-800">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400" />
    </div>
  );
}
