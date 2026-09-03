"use client";

import { ArrowLeft, ShieldCheck, CheckCircle2, Umbrella } from "lucide-react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";

export default function SubscriptionPage() {
  const router = useRouter();

  return (
    <div className="p-4 space-y-5 pb-24 bg-gray-50 min-h-screen max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Langganan KlinikSehat</h1>
          <p className="text-xs text-gray-500">Proteksi & akses dokter 24/7</p>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-br from-primary-600 to-blue-700 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
        <Umbrella className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4" />
        <span className="bg-amber-400 text-amber-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          KlinikSehat Protection
        </span>
        <h2 className="text-xl font-bold mt-2">Langganan Hemat Kesehatan Keluarga</h2>
        <p className="text-xs text-primary-100 mt-1">Konsultasi dokter tanpa batas, diskon obat hingga 30%, dan bebas antre.</p>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        <PlanCard
          title="Paket Perorangan"
          price="Rp 49.000"
          period="/bulan"
          features={[
            "Konsultasi Dokter Umum tanpa batas",
            "Diskon 15% pembelian obat",
            "Bebas antre konsultasi online",
          ]}
          isPopular={false}
        />
        <PlanCard
          title="Paket Keluarga Premium"
          price="Rp 99.000"
          period="/bulan"
          features={[
            "Konsultasi Dokter Umum & Spesialis (hingga 4 anggota)",
            "Diskon 30% pembelian obat & gratis ongkir",
            "Layanan AI Screening 24/7",
            "Prioritas pembuatan janji temu",
          ]}
          isPopular={true}
        />
      </div>

      <BottomNav />
    </div>
  );
}

function PlanCard({ title, price, period, features, isPopular }: any) {
  return (
    <div className={`p-5 rounded-3xl border ${isPopular ? "border-primary-500 bg-white ring-2 ring-primary-500/20 shadow-md" : "border-gray-200 bg-white"} relative`}>
      {isPopular && (
        <span className="absolute -top-3 right-5 bg-primary-600 text-white text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
          Paling Laris
        </span>
      )}
      <h3 className="font-bold text-gray-900 text-base">{title}</h3>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-black text-primary-600">{price}</span>
        <span className="text-xs text-gray-500 font-medium">{period}</span>
      </div>
      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
        {features.map((feat: string, idx: number) => (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{feat}</span>
          </div>
        ))}
      </div>
      <button className={`w-full mt-5 py-3 rounded-2xl font-bold text-xs transition ${isPopular ? "bg-primary-600 text-white hover:bg-primary-700 shadow-sm" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}>
        Pilih Paket
      </button>
    </div>
  );
}
