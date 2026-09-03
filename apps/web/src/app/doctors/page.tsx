"use client";

import { useState } from "react";
import {
  Search,
  Calendar,
  MapPin,
  Flame,
  ThumbsUp,
  Mail,
  User,
  Menu,
  Stethoscope,
  Activity,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";

interface Procedure {
  id: string;
  title: string;
  category: string;
  location: string;
  distance: string;
  patientCount: string;
  isAvailableSoon: boolean;
  isPopular?: boolean;
  price: string;
  rating: string;
  reviews: string;
  imageBg: string;
}

const MOCK_PROCEDURES: Procedure[] = [
  {
    id: "1",
    title: "Irigasi Telinga di KlinikSehat ke Rumah Jakarta Pusat",
    category: "Irigasi Telinga",
    location: "Jakarta Pusat, Jakarta",
    distance: "1.42 km dari Anda",
    patientCount: "711 pasien sudah buat janji di rumah sakit ini",
    isAvailableSoon: true,
    isPopular: true,
    price: "Rp199.000",
    rating: "100%",
    reviews: "43",
    imageBg: "bg-blue-600",
  },
  {
    id: "2",
    title: "Melahirkan Normal di Mitra Keluarga Kemayoran",
    category: "Melahirkan Normal",
    location: "Kemayoran, Jakarta",
    distance: "1.05 km dari Anda",
    patientCount: "16,6rb pasien sudah buat janji di rumah sakit ini",
    isAvailableSoon: true,
    isPopular: false,
    price: "Rp12.500.000",
    rating: "99%",
    reviews: "154",
    imageBg: "bg-teal-600",
  },
  {
    id: "3",
    title: "Konsultasi Dokter Spesialis Anak",
    category: "Spesialis Anak",
    location: "KlinikSehat Cabang Selatan",
    distance: "2.10 km dari Anda",
    patientCount: "4,9rb pasien sudah buat janji",
    isAvailableSoon: true,
    isPopular: true,
    price: "Rp150.000",
    rating: "98%",
    reviews: "820",
    imageBg: "bg-purple-600",
  },
];

export default function DoctorBookingPage() {
  const [activeCategoryTab, setActiveCategoryTab] = useState("Dokter");
  const [activeSpecTab, setActiveSpecTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("");

  const filteredProcedures = MOCK_PROCEDURES.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesLetter =
      selectedLetter === "" ||
      item.title.toUpperCase().startsWith(selectedLetter) ||
      item.category.toUpperCase().startsWith(selectedLetter);
    const matchesSpec =
      activeSpecTab === "Semua" ||
      item.category.toLowerCase().includes(activeSpecTab.toLowerCase());

    return matchesSearch && matchesLetter && matchesSpec;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto relative">
      {/* Top Blue Header */}
      <div className="bg-gradient-to-b from-primary-600 to-primary-700 text-white p-4 pt-6 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-white" />
            <h1 className="text-lg font-black tracking-wide uppercase">KLINIKSEHAT</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition">
              <Mail className="w-5 h-5 text-white" />
            </button>
            <Link href="/profile/patient" className="p-0.5 bg-white/20 rounded-full hover:bg-white/30 transition">
              <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white text-white font-bold flex items-center justify-center text-xs">
                S
              </div>
            </Link>
          </div>
        </div>

        {/* Header Card: Buat Janji Konsultasi */}
        <div className="bg-white text-gray-900 rounded-3xl p-4 mt-4 shadow-lg border border-gray-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-pink-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 leading-tight">Buat Janji Konsultasi</h2>
            <p className="text-xs text-gray-500 mt-0.5">Proses singkat, Tanpa Antre</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Bar with optimized placeholder */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari dokter, spesialisasi, atau tindakan A-Z..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-hidden focus:ring-2 focus:ring-primary-500 shadow-xs font-medium"
          />
        </div>

        {/* A-Z Alphabet Quick Bar */}
        <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 mb-1 px-1">
            <span>Filter Cepat Nama (A-Z):</span>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter("")}
                className="text-primary-600 hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
            <button
              onClick={() => setSelectedLetter("")}
              className={`px-2.5 py-1 rounded-lg transition shrink-0 ${
                selectedLetter === ""
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Semua
            </button>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((char) => (
              <button
                key={char}
                onClick={() => setSelectedLetter(char)}
                className={`w-6 h-6 flex items-center justify-center rounded-lg transition shrink-0 ${
                  selectedLetter === char
                    ? "bg-primary-600 text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {char}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Category Tabs (Dokter, Lab Test NEW, Tindakan Medis) */}
        <div className="grid grid-cols-3 bg-gray-200/60 p-1 rounded-2xl text-xs font-bold text-center">
          <button
            onClick={() => setActiveCategoryTab("Dokter")}
            className={`py-2 rounded-xl transition-all ${
              activeCategoryTab === "Dokter" ? "bg-white text-primary-600 shadow-xs" : "text-gray-600"
            }`}
          >
            Dokter
          </button>
          <button
            onClick={() => setActiveCategoryTab("Lab Test")}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              activeCategoryTab === "Lab Test" ? "bg-white text-primary-600 shadow-xs" : "text-gray-600"
            }`}
          >
            <span>Lab Test</span>
            <span className="bg-amber-400 text-amber-950 text-[8px] px-1 py-0.2 rounded font-extrabold">NEW</span>
          </button>
          <button
            onClick={() => setActiveCategoryTab("Tindakan Medis")}
            className={`py-2 rounded-xl transition-all ${
              activeCategoryTab === "Tindakan Medis" ? "bg-white text-primary-600 shadow-xs" : "text-gray-600"
            }`}
          >
            Tindakan Medis
          </button>
        </div>

        {/* Specialization Filter Pills */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
          <div className="flex gap-1 overflow-x-auto no-scrollbar text-xs font-semibold">
            {["Semua", "Kandungan", "Anak", "THT", "Mata"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSpecTab(tab)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeSpecTab === tab
                    ? "bg-primary-50 text-primary-600 font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 border-l border-gray-100 ml-1">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Cards List */}
        <div className="space-y-4">
          {filteredProcedures.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-4 space-y-3 hover:border-primary-100 transition">
              <div className="flex gap-3">
                <div className={`w-20 h-20 rounded-2xl ${item.imageBg} text-white flex items-center justify-center font-bold shrink-0 shadow-inner`}>
                  <Activity className="w-8 h-8 text-white/80" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.title}</h3>
                  <div className="space-y-0.5 mt-1 text-[11px] text-gray-500">
                    <p className="font-medium text-gray-700">{item.category}</p>
                    <p>{item.location}</p>
                    <p className="text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400 inline" /> {item.distance}
                    </p>
                  </div>
                  <span className="inline-block mt-1 text-[10px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md font-semibold">
                    {item.patientCount}
                  </span>
                </div>
              </div>

              {/* Status & Availability Badges */}
              <div className="space-y-1 text-xs border-t border-gray-50 pt-2">
                {item.isAvailableSoon && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Jadwal Tersedia Segera</span>
                  </div>
                )}
                {item.isPopular && (
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px]">
                    <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Paling Dicari - Slot tindakan ini segera habis.</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Biaya, Ulasan, Buat Janji Button */}
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">Biaya</span>
                  <span className="font-extrabold text-orange-600 text-sm">{item.price}</span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                    <ThumbsUp className="w-3 h-3 text-primary-600 fill-primary-100" />
                    <span className="font-bold text-gray-800">{item.rating}</span>
                    <span className="text-gray-400">({item.reviews})</span>
                  </div>
                </div>

                <Link
                  href="/appointments/new"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-2xl shadow-sm transition active:scale-95"
                >
                  Buat Janji
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
