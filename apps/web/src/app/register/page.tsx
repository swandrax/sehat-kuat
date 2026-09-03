"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Lock,
  ShieldCheck,
  UserPlus,
  Users,
  Stethoscope,
  Sparkles,
  User,
} from "lucide-react";
import { ZavoraLogo } from "@/components/common/ZavoraLogo";
import { toast } from "sonner";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleApplyPreset = (presetName: string, presetEmail: string, presetRole: string) => {
    setName(presetName);
    setEmail(presetEmail);
    setPassword("Password123!");
    setRole(presetRole);
    toast.info(`Preset pendaftaran ${presetName} dipilih!`);
  };

  const handleLocationSync = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"}/users/location`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              }),
            }
          );
        } catch (e) {
          console.error("Failed to sync location", e);
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.data);
        await handleLocationSync();
        toast.success("Pendaftaran akun Zavora Life berhasil!");

        if (data.data.role === "DOCTOR") {
          router.push("/doctor");
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.message || "Pendaftaran gagal, silakan coba lagi");
      }
    } catch {
      toast.error("Terjadi kendala koneksi ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-block">
          <ZavoraLogo size="lg" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Buat Akun Zavora Life
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Mulai langkah hidup sehat Anda bersama platform kesehatan terpadu
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Preset Selector */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Preset Profil Uji Coba Cepat
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset("Budi Santoso", "budi.baru@pasien.id", "PATIENT")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-blue-600" /> Pasien Baru
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("dr. Hendra Pratama, Sp.PD", "dr.hendra@zavoralife.id", "DOCTOR")}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition flex items-center gap-1.5"
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> Dokter Sp.PD
            </button>
          </div>
        </div>

        {/* Register Form */}
        <div className="bg-white dark:bg-slate-900 py-7 px-6 sm:px-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-3.5 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-750 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-750 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Buat Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-750 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tipe Akun
              </label>
              <div className="relative">
                <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-750 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition appearance-none"
                >
                  <option value="PATIENT">Pasien / Pengguna Pribadi</option>
                  <option value="DOCTOR">Dokter Medis (SIP/STR)</option>
                </select>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Daftar Akun Sekarang"
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Keamanan Data Medis Terstandar Zavora Life</span>
        </div>
      </div>
    </div>
  );
}
