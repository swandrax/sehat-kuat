"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  HeartPulse,
  Droplet,
  Moon,
  Footprints,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
  BookOpen,
  Search,
  Star,
  Users,
  Navigation,
  Crosshair,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export default function PatientDashboard() {
  const { user } = useAuthStore();
  const userName = user?.name || "Swandaru Tirta";

  // Geolocation & Precision State
  const [locationPromptOpen, setLocationPromptOpen] = useState(false);
  const [locationState, setLocationState] = useState<{
    latitude: number | null;
    longitude: number | null;
    city: string;
    isPrecisionActive: boolean;
  }>({
    latitude: null,
    longitude: null,
    city: "Jakarta Pusat",
    isPrecisionActive: false,
  });

  useEffect(() => {
    // Check if location is already stored or ask after app load (1.5s after splash)
    const savedLoc = localStorage.getItem("zavora_user_location");
    if (savedLoc) {
      try {
        const parsed = JSON.parse(savedLoc);
        setLocationState({
          latitude: parsed.latitude,
          longitude: parsed.longitude,
          city: parsed.city || "Jakarta Pusat",
          isPrecisionActive: true,
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      const timer = setTimeout(() => {
        setLocationPromptOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRequestLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("Perangkat Anda tidak mendukung geolokasi GPS");
      setLocationPromptOpen(false);
      return;
    }

    toast.info("Meminta izin akses GPS presisi...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;

        const locData = {
          latitude,
          longitude,
          city: "Jakarta Pusat (Presisi GPS ±" + Math.round(accuracy) + "m)",
          isPrecisionActive: true,
        };

        setLocationState(locData);
        localStorage.setItem("zavora_user_location", JSON.stringify(locData));
        setLocationPromptOpen(false);

        toast.success("Lokasi Google Maps & GPS presisi berhasil diaktifkan!");

        // Sync with API backend if user logged in
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
          await fetch(`${apiUrl}/users/location`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ latitude, longitude }),
          });
        } catch (e) {
          console.error("Failed to sync location to API", e);
        }
      },
      (error) => {
        console.warn("Geolocation permission error or dismissed:", error.message);
        toast.info("Akses lokasi dinonaktifkan. Anda tetap dapat menggunakan perkiraan area.");
        setLocationPromptOpen(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="space-y-6">
      {/* 0. Google Maps & GPS Precision Permission Banner */}
      {locationPromptOpen && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Crosshair className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-900/50 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  Akurasi Google Maps
                </span>
              </div>
              <h3 className="text-sm font-black">Aktifkan Lokasi Presisi untuk Faskes Terdekat</h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
                Izinkan Zavora Life mengakses koordinat GPS Anda untuk menampilkan estimasi jarak klinik, dokter terdekat, dan navigasi rute secara akurat.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end shrink-0">
            <button
              onClick={() => setLocationPromptOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-100 hover:text-white transition"
            >
              Nanti Saja
            </button>
            <button
              onClick={handleRequestLocation}
              className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" /> Izinkan Lokasi Presisi
            </button>
          </div>
        </div>
      )}

      {/* 1. Welcome Banner & Hero */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xs relative overflow-hidden transition-colors">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-50/60 dark:from-emerald-950/20 to-transparent pointer-events-none hidden md:block"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Status Kesehatan: Prima & Terpantau
            </div>

            {/* GPS Precision Active Status Pill */}
            {locationState.isPrecisionActive && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{locationState.city}</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Halo, {userName} 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Selamat datang di <span className="font-bold text-emerald-600 dark:text-emerald-400">Zavora Life</span>. Pantau tanda vital harian, jadwal konsultasi dokter spesialis terdekat, dan asisten kesehatan terpercaya.
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5">
            <Link
              href="/appointments/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95"
            >
              <Calendar className="w-4 h-4" /> Buat Janji Konsultasi
            </Link>
            <Link
              href="/ai-screening"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl text-xs font-bold shadow-2xs transition"
            >
              <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Tanya AI Health Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Main 2-Column Grid: Left (Upcoming & Vitals) / Right (AI Assistant & Recs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Appointment Card */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Janji Temu Mendatang</h2>
              </div>
              <Link
                href="/appointments"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Kelola Semua <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-100 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
                  <Stethoscope className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">dr. Andi Setiawan, Sp.PD</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                      Terkonfirmasi
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <span>Spesialis Penyakit Dalam</span>
                    <span>•</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">Klinik Zavora Life Pusat</span>
                  </p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2 pt-0.5">
                    <Clock className="w-3.5 h-3.5" /> Besok, 10:00 WIB (Antrean #4)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:self-center">
                <Link
                  href="/appointments"
                  className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition shadow-2xs"
                >
                  Detail
                </Link>
                <Link
                  href="/doctor/consultations/apt-1"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Ruang Periksa
                </Link>
              </div>
            </div>
          </section>

          {/* Health Summary Vitals */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Ringkasan Tanda Vital</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Kondisi kesehatan harian Anda</p>
              </div>
              <Link
                href="/tracker"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Tracker Lengkap <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Vitals Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <VitalBox
                title="Tekanan Darah"
                value="120/80"
                unit="mmHg"
                status="Optimal"
                icon={<HeartPulse className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                bgColor="bg-emerald-50 dark:bg-emerald-950/60"
              />
              <VitalBox
                title="Gula Darah"
                value="95"
                unit="mg/dL"
                status="Normal"
                icon={<Droplet className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                bgColor="bg-blue-50 dark:bg-blue-950/60"
              />
              <VitalBox
                title="Berat Badan"
                value="68.5"
                unit="kg"
                status="Stabil"
                icon={<Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                bgColor="bg-purple-50 dark:bg-purple-950/60"
              />
              <VitalBox
                title="Tidur Semalam"
                value="7.5"
                unit="jam"
                status="Cukup"
                icon={<Moon className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                bgColor="bg-amber-50 dark:bg-amber-950/60"
              />
            </div>

            {/* Health Progress Chart Visualizer */}
            <div className="bg-slate-50/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-750 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Tren Aktivitas & Vital 7 Hari Terakhir
                </span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">92% Skor Kebugaran</span>
              </div>

              {/* Minimalist Progress Bar Chart */}
              <div className="grid grid-cols-7 gap-2 pt-2 items-end h-20">
                {[
                  { day: "Sen", val: 70 },
                  { day: "Sel", val: 85 },
                  { day: "Rab", val: 65 },
                  { day: "Kam", val: 90 },
                  { day: "Jum", val: 80 },
                  { day: "Sab", val: 95 },
                  { day: "Min", val: 88 },
                ].map((item, idx) => (
                  <div key={item.day} className="flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className={`w-full max-w-[28px] rounded-t-lg transition-all ${
                        idx === 6 ? "bg-emerald-600 dark:bg-emerald-500" : "bg-emerald-200 dark:bg-emerald-800/60"
                      }`}
                      style={{ height: `${item.val}%` }}
                    ></div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Recommended Doctors with Distance from User GPS */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Dokter Terdekat di Sekitar Anda</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {locationState.isPrecisionActive
                    ? "Diurutkan berdasarkan estimasi jarak GPS terdekat"
                    : "Jadwalkan telekonsultasi atau kunjungan klinik"}
                </p>
              </div>
              <Link
                href="/doctors"
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                Semua Dokter <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <DoctorCard
                name="dr. Amanda Kartika, Sp.A"
                specialty="Spesialis Anak (Pediatri)"
                clinic="Klinik Zavora Life Selatan"
                distance="1.4 km dari lokasi Anda"
                experience="5 Tahun"
                rating="4.9"
                reviews="340"
              />
              <DoctorCard
                name="dr. Hendra Pratama, Sp.PD"
                specialty="Spesialis Penyakit Dalam"
                clinic="Klinik Zavora Life Pusat"
                distance="2.1 km dari lokasi Anda"
                experience="8 Tahun"
                rating="5.0"
                reviews="512"
              />
            </div>
          </section>
        </div>

        {/* Right Column (Span 1) */}
        <div className="space-y-6">
          {/* AI Health Assistant Shortcut Card */}
          <section className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            <Bot className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 pointer-events-none" />
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-xs">
                  <Bot className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  AI Screening
                </span>
              </div>

              <h3 className="text-lg font-bold leading-snug">
                Punya Keluhan Kesehatan?
              </h3>
              <p className="text-xs text-emerald-100/90 leading-relaxed">
                Tanyakan gejala atau pahami hasil lab Anda dengan AI Health Assistant Zavora Life sebelum berkonsultasi dengan dokter.
              </p>

              <div className="pt-2">
                <Link
                  href="/ai-screening"
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white text-emerald-900 font-bold rounded-xl text-xs hover:bg-emerald-50 transition shadow-sm"
                >
                  Mulai Screening AI <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-[10px] text-emerald-200/70 pt-1 leading-tight">
                *Analisis awal untuk panduan umum, bukan diagnosis final pengganti dokter.
              </p>
            </div>
          </section>

          {/* Recommended Health Articles */}
          <section className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3.5 transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Edukasi & Artikel Sehat
              </h2>
              <Link href="/articles" className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              <Link
                href="/articles"
                className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-750 transition space-y-1 group"
              >
                <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full uppercase">
                  Pencegahan
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition leading-snug">
                  10 Tips Menjaga Kesehatan Jantung di Usia Produktif
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">dr. Budi Setiawan • 5 min baca</p>
              </Link>

              <Link
                href="/articles"
                className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-750 transition space-y-1 group"
              >
                <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-950/60 px-2 py-0.5 rounded-full uppercase">
                  Gizi & Nutrisi
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition leading-snug">
                  Pola Makan Tepat untuk Menstabilkan Gula Darah
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">dr. Amanda Kartika • 4 min baca</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function VitalBox({
  title,
  value,
  unit,
  status,
  icon,
  bgColor,
}: {
  title: string;
  value: string;
  unit: string;
  status: string;
  icon: React.ReactNode;
  bgColor: string;
}) {
  return (
    <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-750 space-y-2">
      <div className="flex items-center justify-between">
        <div className={`p-1.5 rounded-lg ${bgColor}`}>{icon}</div>
        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-md border border-slate-100 dark:border-slate-750">
          {status}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-lg font-black text-slate-900 dark:text-white">{value}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function DoctorCard({
  name,
  specialty,
  clinic,
  distance,
  experience,
  rating,
  reviews,
}: {
  name: string;
  specialty: string;
  clinic: string;
  distance: string;
  experience: string;
  rating: string;
  reviews: string;
}) {
  return (
    <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex flex-col justify-between space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{name}</h4>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">{specialty}</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{clinic}</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{distance}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px]">
        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-slate-900 dark:text-white">{rating}</span>
          <span className="text-slate-400">({reviews})</span>
        </div>
        <Link
          href="/appointments/new"
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition shadow-2xs"
        >
          Buat Janji
        </Link>
      </div>
    </div>
  );
}
