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
  UserCheck,
  Activity,
  Stethoscope,
  Sparkles,
  User,
  ShieldAlert,
} from "lucide-react";
import { ZavoraLogo } from "@/components/common/ZavoraLogo";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  // Dummy login profiles for quick non-overlapping testing
  const dummyProfiles = [
    {
      role: "PATIENT",
      name: "Budi Santoso",
      email: "budi@pasien.id",
      pass: "Password123!",
      badge: "Pasien",
      icon: <User className="w-3.5 h-3.5 text-blue-600" />,
    },
    {
      role: "DOCTOR",
      name: "dr. Andi Setiawan, Sp.PD",
      email: "andi@zavoralife.id",
      pass: "Password123!",
      badge: "Dokter Sp.PD",
      icon: <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      role: "DOCTOR",
      name: "dr. Amanda Kartika, Sp.A",
      email: "amanda.kartika@zavoralife.id",
      pass: "Password123!",
      badge: "Dokter Sp.A",
      icon: <Stethoscope className="w-3.5 h-3.5 text-teal-600" />,
    },
    {
      role: "DOCTOR",
      name: "dr. Budi Setiawan, Sp.JP",
      email: "budi.setiawan@zavoralife.id",
      pass: "Password123!",
      badge: "Dokter Sp.JP",
      icon: <Stethoscope className="w-3.5 h-3.5 text-purple-600" />,
    },
    {
      role: "ADMIN",
      name: "Admin Zavora Life",
      email: "admin@zavoralife.id",
      pass: "Password123!",
      badge: "Admin",
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />,
    },
  ];

  const handleSelectDummy = (item: (typeof dummyProfiles)[0]) => {
    setEmail(item.email);
    setPassword(item.pass);
    toast.info(`Akun demo ${item.name} (${item.badge}) dipilih!`);
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
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.data);
        await handleLocationSync();
        toast.success("Selamat datang kembali di Zavora Life!");

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
          Masuk ke Akun Zavora Life
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Akses riwayat kesehatan, konsultasi dokter, dan monitoring tanda vital
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        {/* Quick Demo Accounts Pill Selector */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Pilih Akun Demo Cepat
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Password: Password123!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {dummyProfiles.map((item) => (
              <button
                key={item.email}
                type="button"
                onClick={() => handleSelectDummy(item)}
                className={`p-2 rounded-xl text-left border transition text-xs flex items-center gap-2 ${
                  email === item.email
                    ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-100 dark:border-slate-750 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-600">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold truncate leading-tight">{item.name}</p>
                  <p className="text-[9px] text-slate-400 truncate">{item.email}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-slate-900 py-7 px-6 sm:px-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                "Masuk Sekarang"
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Belum memiliki akun?{" "}
              <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                Daftar Akun Baru
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
