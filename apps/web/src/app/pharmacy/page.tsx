"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Search,
  Pill,
  ExternalLink,
  ShieldCheck,
  Info,
  CheckCircle2,
  Tag,
  ArrowRight,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  category: "Obat Bebas" | "Resep Dokter" | "Suplemen & Vitamin" | "Alat Kesehatan";
  price: string;
  description: string;
  partnerName: string;
  dosageForm: string;
  badgeColor: string;
}

const PRODUCTS_DATA: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500mg (10 Tablet)",
    category: "Obat Bebas",
    price: "Rp 6.500",
    description: "Meredakan rasa sakit kepala, sakit gigi, serta menurunkan demam pada orang dewasa dan anak.",
    partnerName: "Kimia Farma & K24",
    dosageForm: "Tablet Salut",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    id: 2,
    name: "Vitamin C 1000mg + Zinc (30 Kaplet)",
    category: "Suplemen & Vitamin",
    price: "Rp 52.000",
    description: "Membantu memelihara daya tahan tubuh dan mempercepat proses pemulihan pasca sakit.",
    partnerName: "Century & Watsons",
    dosageForm: "Kaplet Effervescent",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
  },
  {
    id: 3,
    name: "Amoxicillin 500mg (Harus Resep)",
    category: "Resep Dokter",
    price: "Rp 15.000",
    description: "Antibiotik spektrum luas untuk mengatasi infeksi bakteri saluran pernapasan dan saluran kemih.",
    partnerName: "Apotek Mitra Zavora Life",
    dosageForm: "Kapsul",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
  },
  {
    id: 4,
    name: "Tensimeter Digital Otomatis Lengan Atas",
    category: "Alat Kesehatan",
    price: "Rp 320.000",
    description: "Alat ukur tekanan darah digital akurat dengan indikator detak jantung tidak beraturan (IHB).",
    partnerName: "Omron Healthcare Official",
    dosageForm: "Device Medis",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
  },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = [
    "Semua",
    "Obat Bebas",
    "Suplemen & Vitamin",
    "Resep Dokter",
    "Alat Kesehatan",
  ];

  const handlePartnerRedirect = (prodName: string, partner: string) => {
    toast.success(`Mengarahkan Anda ke partner resmi: ${partner} untuk ${prodName}`);
  };

  const filteredProducts = PRODUCTS_DATA.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      selectedCategory === "Semua" || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Apotek & Marketplace Mitra Terpercaya</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Produk Kesehatan & Obat-Obatan
          </h1>
          <p className="text-xs text-slate-500">
            Daftar suplemen, obat bebas, dan perangkat medis dari jaringan apotek resmi Zavora Life
          </p>
        </div>

        <div className="bg-emerald-50 px-3.5 py-2 rounded-2xl border border-emerald-200/80 flex items-center gap-2 text-xs text-emerald-900 self-start">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">100% Produk Asli & Terdaftar BPOM</span>
        </div>
      </div>

      {/* Prescription Notice Banner */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900">Punya Resep Digital dari Dokter?</h3>
            <p className="text-xs text-slate-500">
              Resep yang diterbitkan dari sesi telemedisin Zavora Life langsung terhubung ke apotek mitra.
            </p>
          </div>
        </div>
        <Link
          href="/appointments"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap self-stretch sm:self-auto text-center"
        >
          Lihat Resep Saya
        </Link>
      </div>

      {/* Search & Categories */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari obat, vitamin, suplemen, atau alat kesehatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white font-bold shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-full h-32 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                <Pill className="w-12 h-12 text-emerald-600/30" />
              </div>

              <div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${prod.badgeColor}`}
                >
                  {prod.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{prod.name}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {prod.description}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] text-slate-400">Harga Estimasi</span>
                <span className="text-sm font-black text-emerald-700">{prod.price}</span>
              </div>

              <button
                onClick={() => handlePartnerRedirect(prod.name, prod.partnerName)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Beli via Partner Resmi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <p className="text-[9px] text-slate-400 text-center">Tersedia di: {prod.partnerName}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
