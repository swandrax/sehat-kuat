"use client";

import { useState } from "react";
import {
  ShieldAlert,
  Users,
  Stethoscope,
  DollarSign,
  Activity,
  FileCheck2,
  Lock,
  Bot,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="p-4 space-y-6 pb-28 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Control Center</h1>
            <p className="text-xs text-gray-500">Monitoring Sistem & Keamanan KlinikSehat</p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Online
        </span>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Pasien</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">1,248</p>
          <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% bulan ini
          </p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Dokter Aktif</span>
            <Stethoscope className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">36</p>
          <p className="text-[10px] text-amber-600 font-semibold mt-1">3 menunggu verifikasi</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pendapatan Bulan Ini</span>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">Rp 48.5M</p>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1">Target 95% tercapai</p>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Queries / Hari</span>
            <Bot className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-2">520</p>
          <p className="text-[10px] text-primary-600 font-semibold mt-1">Latensi rata-rata: 140ms</p>
        </div>
      </div>

      {/* Admin Quick Action Menu */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-gray-900">Modul Manajemen & Keamanan</h2>

        <div className="space-y-2.5">
          <Link
            href="/admin/doctors"
            className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-xs transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Verifikasi Kredensial Dokter</h3>
                <p className="text-[11px] text-gray-500">Validasi SIP, STR, dan aktivasi akun dokter baru</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-full">
              3 Pending
            </span>
          </Link>

          <Link
            href="/admin/audit"
            className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 shadow-xs transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Audit Logs & Security Monitor</h3>
                <p className="text-[11px] text-gray-500">Pencatatan akses rekam medis, login, & mutasi role</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>
      </div>

      {/* System Security Notice */}
      <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 space-y-1">
          <p className="font-bold">Keamanan Terproteksi Penuh</p>
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            Semua request API diamankan dengan NestJS Throttler Rate Limiter, Helmet Security Headers, dan RBAC Guard berbasis Role.
          </p>
        </div>
      </div>
    </div>
  );
}
