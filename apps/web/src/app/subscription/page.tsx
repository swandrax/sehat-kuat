"use client";

import { ArrowLeft, ShieldCheck, CheckCircle2, Umbrella, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { toast } from "sonner";

export default function SubscriptionPage() {
  const router = useRouter();

  const handleSelectPlan = (planName: string) => {
    toast.success(`Paket ${planName} dipilih. Mengarahkan ke pembayaran Zavora Life...`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-2xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Langganan Zavora Life Protection</h1>
          <p className="text-xs text-slate-500">Proteksi preventif & akses dokter spesialis 24/7</p>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-900 text-white p-6 rounded-3xl shadow-md relative overflow-hidden space-y-3">
        <Umbrella className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4" />
        <span className="bg-emerald-400 text-emerald-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          Zavora Life Protection
        </span>
        <h2 className="text-xl font-black text-white">Langganan Hemat Kesehatan Keluarga</h2>
        <p className="text-xs text-emerald-100/90 leading-relaxed max-w-md">
          Konsultasi dokter tanpa batas, diskon obat hingga 30%, dan prioritas antrean telemedisin.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PlanCard
          title="Paket Perorangan"
          price="Rp 49.000"
          period="/bulan"
          features={[
            "Konsultasi Dokter Umum tanpa batas",
            "Diskon 15% apotek mitra resmi",
            "Akses AI Health Assistant 24/7",
            "Penyimpanan Rekam Medis Cloud",
          ]}
          isPopular={false}
          onSelect={() => handleSelectPlan("Paket Perorangan")}
        />
        <PlanCard
          title="Paket Keluarga Premium"
          price="Rp 99.000"
          period="/bulan"
          features={[
            "Konsultasi Dokter Spesialis (hingga 4 anggota)",
            "Diskon 30% apotek & gratis ongkir",
            "Prioritas nomor antrean periksa",
            "Monitoring tanda vital keluarga",
          ]}
          isPopular={true}
          onSelect={() => handleSelectPlan("Paket Keluarga Premium")}
        />
      </div>

      <BottomNav />
    </div>
  );
}

function PlanCard({
  title,
  price,
  period,
  features,
  isPopular,
  onSelect,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 relative transition ${
        isPopular
          ? "border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-md"
          : "border-slate-200 bg-white shadow-2xs"
      }`}
    >
      {isPopular && (
        <span className="absolute -top-3 right-5 bg-emerald-600 text-white text-[9px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
          Rekomendasi
        </span>
      )}
      <div>
        <h3 className="font-bold text-slate-900 text-base">{title}</h3>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl font-black text-emerald-700">{price}</span>
          <span className="text-xs text-slate-400 font-medium">{period}</span>
        </div>
        <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
          {features.map((feat: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onSelect}
        className={`w-full py-3 rounded-2xl font-bold text-xs transition active:scale-95 ${
          isPopular
            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
            : "bg-slate-100 text-slate-800 hover:bg-slate-200"
        }`}
      >
        Pilih Paket
      </button>
    </div>
  );
}
