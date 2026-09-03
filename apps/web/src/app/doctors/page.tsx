"use client";

import { useState } from "react";
import {
  Search,
  Stethoscope,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DoctorProfile {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  rating: string;
  reviewCount: number;
  clinic: string;
  distance: string;
  price: string;
  nextSlot: string;
  isAvailableToday: boolean;
  avatarBg: string;
}

const DOCTOR_DATA: DoctorProfile[] = [
  {
    id: "doc-1",
    name: "dr. Andi Setiawan, Sp.PD",
    specialization: "Spesialis Penyakit Dalam",
    experienceYears: 8,
    rating: "4.9",
    reviewCount: 428,
    clinic: "Klinik Cabang Pusat",
    distance: "1.2 km",
    price: "Rp 150.000",
    nextSlot: "Hari ini, 14:00 WIB",
    isAvailableToday: true,
    avatarBg: "bg-emerald-600",
  },
  {
    id: "doc-2",
    name: "dr. Amanda Kartika, Sp.A",
    specialization: "Spesialis Anak (Pediatri)",
    experienceYears: 6,
    rating: "5.0",
    reviewCount: 312,
    clinic: "Klinik Cabang Selatan",
    distance: "2.5 km",
    price: "Rp 160.000",
    nextSlot: "Hari ini, 16:30 WIB",
    isAvailableToday: true,
    avatarBg: "bg-teal-600",
  },
  {
    id: "doc-3",
    name: "dr. Budi Setiawan, Sp.JP",
    specialization: "Spesialis Jantung & Pembuluh Darah",
    experienceYears: 12,
    rating: "4.9",
    reviewCount: 520,
    clinic: "Klinik Cabang Pusat",
    distance: "1.2 km",
    price: "Rp 250.000",
    nextSlot: "Besok, 09:00 WIB",
    isAvailableToday: false,
    avatarBg: "bg-slate-700",
  },
  {
    id: "doc-4",
    name: "dr. Rina Wijaya",
    specialization: "Dokter Umum",
    experienceYears: 4,
    rating: "4.8",
    reviewCount: 190,
    clinic: "Klinik Cabang Barat",
    distance: "3.1 km",
    price: "Rp 85.000",
    nextSlot: "Hari ini, 13:00 WIB",
    isAvailableToday: true,
    avatarBg: "bg-emerald-700",
  },
];

export default function DoctorDiscoveryPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Semua");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);

  const specialties = [
    "Semua",
    "Penyakit Dalam",
    "Anak",
    "Jantung",
    "Dokter Umum",
    "Kulit",
    "Mata",
    "THT",
  ];

  const filteredDoctors = DOCTOR_DATA.filter((doc) => {
    const matchSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
      doc.clinic.toLowerCase().includes(search.toLowerCase());

    const matchSpec =
      selectedSpecialty === "Semua" ||
      doc.specialization.toLowerCase().includes(selectedSpecialty.toLowerCase());

    const matchLetter =
      selectedLetter === "" || doc.name.toUpperCase().startsWith(selectedLetter);

    const matchAvail = !onlyAvailableToday || doc.isAvailableToday;

    return matchSearch && matchSpec && matchLetter && matchAvail;
  });

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dokter Terverifikasi & Berlisensi STR/SIP</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Temukan Dokter Spesialis
          </h1>
          <p className="text-xs text-slate-500">
            Jadwalkan konsultasi tatap muka atau telemedisin dengan dokter ahli terpercaya
          </p>
        </div>

        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold transition shadow-2xs self-start"
        >
          <Calendar className="w-4 h-4 text-emerald-600" /> Janji Temu Saya
        </Link>
      </div>

      {/* Filter & Search Panel */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari dokter, spesialisasi, atau lokasi klinik A-Z..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        {/* A-Z Quick Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            A-Z:
          </span>
          <button
            onClick={() => setSelectedLetter("")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 ${
              selectedLetter === ""
                ? "bg-emerald-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua
          </button>
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
            <button
              key={char}
              onClick={() => setSelectedLetter(char)}
              className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-bold transition shrink-0 ${
                selectedLetter === char
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {char}
            </button>
          ))}
        </div>

        {/* Specialization Chips & Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                  selectedSpecialty === spec
                    ? "bg-emerald-100/80 text-emerald-800 font-bold border border-emerald-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                }`}
              >
                {spec}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyAvailableToday}
              onChange={(e) => setOnlyAvailableToday(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
            />
            <span>Hanya yang buka hari ini</span>
          </label>
        </div>
      </section>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada dokter ditemukan</h3>
            <p className="text-xs text-slate-500">
              Coba sesuaikan kata kunci pencarian atau reset filter A-Z Anda.
            </p>
          </div>
        ) : (
          filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
            >
              {/* Doctor Header */}
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-14 h-14 rounded-2xl ${doc.avatarBg} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-inner`}
                >
                  {doc.name.replace(/^dr\.\s*/, "").charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{doc.name}</h3>
                    <span title="Terverifikasi STR & SIP">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    {doc.specialization}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{doc.clinic}</span>
                    <span className="text-slate-300">•</span>
                    <span>{doc.distance}</span>
                  </p>
                </div>
              </div>

              {/* Badges Info */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Pengalaman</span>
                  <span className="font-bold text-slate-800">{doc.experienceYears} Tahun</span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-medium">Penilaian</span>
                  <span className="font-bold text-slate-900 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {doc.rating}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Biaya Mulai</span>
                  <span className="font-bold text-emerald-700">{doc.price}</span>
                </div>
              </div>

              {/* Slot Availability & Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block">Jadwal Terdekat</span>
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> {doc.nextSlot}
                  </span>
                </div>

                <Link
                  href={`/doctors/${doc.id}`}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition active:scale-95 flex items-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" /> Buat Janji
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
