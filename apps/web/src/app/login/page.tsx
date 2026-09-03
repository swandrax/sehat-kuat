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
  User,
  Stethoscope,
  ShieldAlert,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { ZavoraLogo } from "@/components/common/ZavoraLogo";
import { toast } from "sonner";

type LoginRole = "PATIENT" | "DOCTOR" | "ADMIN";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<LoginRole>("PATIENT");
  const [email, setEmail] = useState("budi@pasien.id");
  const [password, setPassword] = useState("Password123!");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  // Clean role switcher presets
  const handleRoleChange = (role: LoginRole) => {
    setSelectedRole(role);
    if (role === "PATIENT") {
      setEmail("budi@pasien.id");
      setPassword("Password123!");
    } else if (role === "DOCTOR") {
      setEmail("andi@zavoralife.id");
      setPassword("Password123!");
    } else if (role === "ADMIN") {
      setEmail("admin@zavoralife.id");
      setPassword("Password123!");
    }
  };

  const doctorPresets = [
    { name: "dr. Andi Setiawan, Sp.PD (Penyakit Dalam)", email: "andi@zavoralife.id" },
    { name: "dr. Amanda Kartika, Sp.A (Anak)", email: "amanda.kartika@zavoralife.id" },
    { name: "dr. Budi Setiawan, Sp.JP (Jantung)", email: "budi.setiawan@zavoralife.id" },
    { name: "dr. Hendra Pratama, Sp.PD (Penyakit Dalam)", email: "hendra.pratama@zavoralife.id" },
  ];

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
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.data);
        await handleLocationSync();
        toast.success(`Selamat datang, ${data.data.name || "di Zavora Life"}!`);

        if (data.data.role === "DOCTOR") {
          router.push("/doctor");
        } else if (data.data.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error(data.message || "Email atau kata sandi tidak sesuai");
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
          Masuk ke Zavora Life
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Pilih peran akun Anda untuk mengakses portal layanan
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Role Tabs Navigation */}
        <div className="flex bg-slate-200/80 dark:bg-slate-800 p-1.5 rounded-2xl text-xs font-bold shadow-2xs">
          <button
            type="button"
            onClick={() => handleRoleChange("PATIENT")}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              selectedRole === "PATIENT"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Pasien</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("DOCTOR")}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              selectedRole === "DOCTOR"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Dokter</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange("ADMIN")}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              selectedRole === "ADMIN"
                ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Clean Login Card */}
        <div className="bg-white dark:bg-slate-900 py-7 px-6 sm:px-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          {/* Header Description of Active Role */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {selectedRole === "PATIENT"
                ? "Portal Pasien"
                : selectedRole === "DOCTOR"
                ? "Portal Dokter Spesialis (SIP/STR)"
                : "Konsol Manajemen Administrator"}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {selectedRole === "PATIENT"
                ? "Akses rekam medis, janji temu, dan riwayat vital Anda."
                : selectedRole === "DOCTOR"
                ? "Akses antrean periksa, konsultasi pasien, dan e-resep."
                : "Akses panel kontrol sistem, verifikasi dokter, dan audit keamanan."}
            </p>
          </div>

          {/* Quick Doctor Account Selector (Only shown on Doctor tab) */}
          {selectedRole === "DOCTOR" && (
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Pilih Dokter yang Terdaftar di Project:
              </label>
              <div className="relative">
                <select
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition appearance-none cursor-pointer"
                >
                  {doctorPresets.map((doc) => (
                    <option key={doc.email} value={doc.email}>
                      {doc.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Alamat Email {selectedRole === "DOCTOR" ? "Dokter" : ""}
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
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="password"
                  placeholder="Masukkan kata sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-750 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
                  required
                />
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
                `Masuk Sebagai ${
                  selectedRole === "PATIENT"
                    ? "Pasien"
                    : selectedRole === "DOCTOR"
                    ? "Dokter"
                    : "Admin"
                }`
              )}
            </button>
          </form>

          {/* Footer note: Register is only for patients */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            {selectedRole === "PATIENT" ? (
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Belum memiliki akun pasien?{" "}
                <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                  Daftar di sini
                </Link>
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Akun {selectedRole === "DOCTOR" ? "Dokter" : "Admin"} diterbitkan secara internal oleh Zavora Life dan tidak memerlukan pendaftaran publik.
              </p>
            )}
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
