"use client";

import { ArrowLeft, HeartPulse, Droplet, Plus, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrackerPage() {
  const router = useRouter();

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
          <h1 className="text-lg font-bold text-gray-900">Tracker Kesehatan</h1>
          <p className="text-xs text-gray-500">Pantau kondisi vital Anda</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <HeartPulse className="absolute -right-4 -bottom-4 w-24 h-24 text-white/20" />
        <div className="relative z-10">
          <h2 className="text-sm font-bold text-rose-50 mb-1">Status Kesehatan Harian</h2>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">Baik</span>
            <span className="text-xs text-rose-100 mb-1.5">Stabil</span>
          </div>
          <p className="text-[10px] text-rose-50 mt-2">Terakhir diperbarui: Hari ini, 08:30 WIB</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TrackerCard 
          title="Tekanan Darah" 
          value="120/80" 
          unit="mmHg" 
          status="Normal" 
          icon={<HeartPulse className="w-5 h-5 text-rose-500" />}
          color="rose"
        />
        <TrackerCard 
          title="Gula Darah" 
          value="95" 
          unit="mg/dL" 
          status="Normal" 
          icon={<Droplet className="w-5 h-5 text-blue-500" />}
          color="blue"
        />
        <TrackerCard 
          title="Detak Jantung" 
          value="72" 
          unit="bpm" 
          status="Normal" 
          icon={<Activity className="w-5 h-5 text-emerald-500" />}
          color="emerald"
        />
        <TrackerCard 
          title="Berat Badan" 
          value="68.5" 
          unit="kg" 
          status="Stabil" 
          icon={<Activity className="w-5 h-5 text-purple-500" />}
          color="purple"
        />
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-dashed border-gray-300 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition shadow-sm">
        <Plus className="w-4 h-4" /> Catat Data Baru
      </button>
    </div>
  );
}

interface TrackerCardProps {
  title: string;
  value: string;
  unit: string;
  status: string;
  icon: React.ReactNode;
  color: "rose" | "blue" | "emerald" | "purple";
}

function TrackerCard({ title, value, unit, status, icon, color }: TrackerCardProps) {
  const colorMap: Record<"rose" | "blue" | "emerald" | "purple", string> = {
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-36">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
          {status}
        </div>
      </div>
      <div>
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-xl font-black text-gray-900">{value}</span>
          <span className="text-[10px] font-semibold text-gray-400">{unit}</span>
        </div>
      </div>
    </div>
  );
}
