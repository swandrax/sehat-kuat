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
import { ZavoraLogo } from "@/components/common/ZavoraLogo";

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Admin Control Center</h1>
            <p className="text-xs text-slate-500">Monitoring Sistem, Kredensial, & Keamanan Zavora Life</p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Zavora Life Engine Online
        </span>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Pasien</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">1,248</p>
          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +12% bulan ini
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Dokter Aktif</span>
            <Stethoscope className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">36</p>
          <p className="text-[10px] text-amber-700 font-semibold mt-1">3 menunggu verifikasi</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pendapatan Bulan Ini</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">Rp 48.5M</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1">Target 95% tercapai</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">AI Queries / Hari</span>
            <Bot className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">520</p>
          <p className="text-[10px] text-emerald-700 font-semibold mt-1">Latensi rata-rata: 140ms</p>
        </div>
      </div>

      {/* Admin Quick Action Menu */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Modul Manajemen & Keamanan</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Link
            href="/admin/doctors"
            className="flex items-center justify-between p-5 bg-white hover:bg-slate-50 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Verifikasi Kredensial Dokter</h3>
                <p className="text-[11px] text-slate-500">Validasi SIP, STR, dan aktivasi akun dokter baru</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 text-[10px] font-bold rounded-full">
              3 Pending
            </span>
          </Link>

          <Link
            href="/admin/audit"
            className="flex items-center justify-between p-5 bg-white hover:bg-slate-50 rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 transition"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-800 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Audit Logs & Security Monitor</h3>
                <p className="text-[11px] text-slate-500">Pencatatan akses rekam medis, login, & mutasi role</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* System Security Notice */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 flex items-start gap-3.5">
        <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-emerald-300">Infrastruktur Keamanan Medis Zavora Life</p>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Semua request API diamankan dengan NestJS Throttler Rate Limiter, Helmet Security Headers, enkripsi AES-256 pada field sensitif, dan RBAC Guard berbasis Role.
          </p>
        </div>
      </div>
    </div>
  );
}
