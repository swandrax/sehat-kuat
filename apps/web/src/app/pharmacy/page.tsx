"use client";

import { ArrowLeft, Search, Pill, ShoppingBag, Info, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PharmacyPage() {
  const router = useRouter();

  const mockMedicines = [
    { id: 1, name: "Paracetamol 500mg", type: "Tablet", price: "Rp 5.000", badge: "Umum" },
    { id: 2, name: "Amoxicillin 500mg", type: "Kapsul", price: "Rp 12.000", badge: "Resep" },
    { id: 3, name: "Vitamin C 1000mg", type: "Tablet Hisap", price: "Rp 45.000", badge: "Suplemen" },
    { id: 4, name: "Ibuprofen 400mg", type: "Tablet", price: "Rp 8.000", badge: "Umum" },
  ];

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Apotek KlinikSehat</h1>
          <p className="text-xs text-gray-500">Pesan obat & vitamin dari rumah</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cari nama obat atau suplemen..." 
          className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="grid grid-cols-4 gap-3">
        <CategoryIcon icon="💊" label="Resep" />
        <CategoryIcon icon="🌿" label="Herbal" />
        <CategoryIcon icon="🍊" label="Vitamin" />
        <CategoryIcon icon="🚑" label="P3K" />
      </div>

      {/* Upload Prescription Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 rounded-3xl text-white shadow-md flex items-center gap-4">
        <div className="bg-white/20 p-3 rounded-2xl">
          <Pill className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-sm">Punya Resep Dokter?</h3>
          <p className="text-[10px] text-green-50 mt-1">Unggah foto resep Anda dan kami akan siapkan obatnya.</p>
        </div>
        <button className="bg-white text-green-700 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm hover:bg-gray-50">
          Unggah
        </button>
      </div>

      {/* Product List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-800">Obat & Vitamin Populer</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {mockMedicines.map((med) => (
            <div key={med.id} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div className={`text-[9px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block ${
                    med.badge === "Resep" ? "bg-red-100 text-red-600" : 
                    med.badge === "Suplemen" ? "bg-orange-100 text-orange-600" : 
                    "bg-green-100 text-green-600"
                  }`}>
                    {med.badge}
                  </div>
                  <Info className="w-3.5 h-3.5 text-gray-300" />
                </div>
                <div className="w-full h-20 bg-gray-50 rounded-xl mb-3 flex items-center justify-center">
                  <Pill className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xs font-bold text-gray-800 leading-tight">{med.name}</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">{med.type}</p>
              </div>
              <div className="mt-3 flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="font-bold text-green-600 text-xs">{med.price}</span>
                <button className="bg-green-50 text-green-600 p-1.5 rounded-lg hover:bg-green-100 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Cart */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-green-700 transition flex items-center justify-center gap-2 shadow-sm">
          <ShoppingBag className="w-4 h-4" /> Keranjang Belanja (0)
        </button>
      </div>
    </div>
  );
}

function CategoryIcon({ icon, label }: { icon: string, label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:bg-green-50 group-hover:border-green-100 transition-colors">
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-gray-600">{label}</span>
    </div>
  );
}
