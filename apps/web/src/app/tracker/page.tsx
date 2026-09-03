"use client";

import { useState } from "react";
import {
  ArrowLeft,
  HeartPulse,
  Droplet,
  Plus,
  Activity,
  Thermometer,
  Weight,
  TrendingUp,
  History,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface VitalLog {
  id: string;
  date: string;
  type: string;
  value: string;
  unit: string;
  status: "Normal" | "Waspada" | "Stabil";
}

export default function TrackerPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<"summary" | "history">("summary");

  // Vitals State
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [bloodSugar, setBloodSugar] = useState("95");
  const [heartRate, setHeartRate] = useState("72");
  const [weight, setWeight] = useState("68.5");
  const [temperature, setTemperature] = useState("36.6");

  // Form State for new entry
  const [formType, setFormType] = useState<"bp" | "sugar" | "hr" | "weight" | "temp">("bp");
  const [formValue, setFormValue] = useState("");

  const [logs, setLogs] = useState<VitalLog[]>([
    { id: "1", date: "Hari ini, 08:30", type: "Tekanan Darah", value: "120/80", unit: "mmHg", status: "Normal" },
    { id: "2", date: "Hari ini, 08:30", type: "Gula Darah", value: "95", unit: "mg/dL", status: "Normal" },
    { id: "3", date: "Kemarin, 19:15", type: "Detak Jantung", value: "72", unit: "bpm", status: "Normal" },
    { id: "4", date: "Kemarin, 07:00", type: "Berat Badan", value: "68.5", unit: "kg", status: "Stabil" },
    { id: "5", date: "2 hari lalu", type: "Suhu Tubuh", value: "36.6", unit: "°C", status: "Normal" },
  ]);

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue) {
      toast.error("Masukkan nilai parameter");
      return;
    }

    const nowStr = "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    if (formType === "bp") {
      setBloodPressure(formValue);
      setLogs(prev => [{ id: Date.now().toString(), date: nowStr, type: "Tekanan Darah", value: formValue, unit: "mmHg", status: "Normal" }, ...prev]);
    } else if (formType === "sugar") {
      setBloodSugar(formValue);
      setLogs(prev => [{ id: Date.now().toString(), date: nowStr, type: "Gula Darah", value: formValue, unit: "mg/dL", status: "Normal" }, ...prev]);
    } else if (formType === "hr") {
      setHeartRate(formValue);
      setLogs(prev => [{ id: Date.now().toString(), date: nowStr, type: "Detak Jantung", value: formValue, unit: "bpm", status: "Normal" }, ...prev]);
    } else if (formType === "weight") {
      setWeight(formValue);
      setLogs(prev => [{ id: Date.now().toString(), date: nowStr, type: "Berat Badan", value: formValue, unit: "kg", status: "Stabil" }, ...prev]);
    } else if (formType === "temp") {
      setTemperature(formValue);
      setLogs(prev => [{ id: Date.now().toString(), date: nowStr, type: "Suhu Tubuh", value: formValue, unit: "°C", status: "Normal" }, ...prev]);
    }

    toast.success("Data tanda vital berhasil dicatat!");
    setModalOpen(false);
    setFormValue("");
  };

  return (
    <div className="p-4 space-y-5 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Tracker Kesehatan</h1>
            <p className="text-xs text-gray-500">Pantau kondisi vital & tren harian Anda</p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Catat
        </button>
      </div>

      {/* Main Banner Status */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-primary-600 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <HeartPulse className="absolute -right-4 -bottom-4 w-28 h-28 text-white/15" />
        <div className="relative z-10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              Kondisi Hari Ini
            </span>
            <span className="text-[10px] text-white/80">Terakhir diperbarui: Baru saja</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black">Normal & Stabil</span>
          </div>
          <p className="text-xs text-rose-100 leading-relaxed max-w-xs">
            Semua parameter tanda vital berada dalam rentang acuan kesehatan optimal.
          </p>
        </div>
      </div>

      {/* View Switcher */}
      <div className="flex bg-gray-200/70 p-1 rounded-2xl">
        <button
          onClick={() => setActiveView("summary")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeView === "summary" ? "bg-white text-primary-900 shadow-sm" : "text-gray-600"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Ringkasan Parameter
        </button>
        <button
          onClick={() => setActiveView("history")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeView === "history" ? "bg-white text-primary-900 shadow-sm" : "text-gray-600"
          }`}
        >
          <History className="w-3.5 h-3.5" /> Riwayat Log ({logs.length})
        </button>
      </div>

      {activeView === "summary" ? (
        <div className="grid grid-cols-2 gap-3.5">
          <TrackerCard
            title="Tekanan Darah"
            value={bloodPressure}
            unit="mmHg"
            status="Normal"
            icon={<HeartPulse className="w-5 h-5 text-rose-500" />}
            color="rose"
          />
          <TrackerCard
            title="Gula Darah"
            value={bloodSugar}
            unit="mg/dL"
            status="Normal"
            icon={<Droplet className="w-5 h-5 text-blue-500" />}
            color="blue"
          />
          <TrackerCard
            title="Detak Jantung"
            value={heartRate}
            unit="bpm"
            status="Normal"
            icon={<Activity className="w-5 h-5 text-emerald-500" />}
            color="emerald"
          />
          <TrackerCard
            title="Berat Badan"
            value={weight}
            unit="kg"
            status="Stabil"
            icon={<Weight className="w-5 h-5 text-purple-500" />}
            color="purple"
          />
          <TrackerCard
            title="Suhu Tubuh"
            value={temperature}
            unit="°C"
            status="Normal"
            icon={<Thermometer className="w-5 h-5 text-amber-500" />}
            color="amber"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-900">{log.type}</p>
                <p className="text-[10px] text-gray-400">{log.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">
                  {log.value} <span className="text-[10px] font-medium text-gray-500">{log.unit}</span>
                </p>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" /> {log.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Catat Tanda Vital Baru</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMetric} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Pilih Parameter
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
                >
                  <option value="bp">Tekanan Darah (mmHg)</option>
                  <option value="sugar">Gula Darah Sewaktu (mg/dL)</option>
                  <option value="hr">Detak Jantung (bpm)</option>
                  <option value="weight">Berat Badan (kg)</option>
                  <option value="temp">Suhu Tubuh (°C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nilai Pengukuran
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formType === "bp"
                      ? "Contoh: 120/80"
                      : formType === "sugar"
                      ? "Contoh: 100"
                      : formType === "hr"
                      ? "Contoh: 75"
                      : formType === "weight"
                      ? "Contoh: 67.5"
                      : "Contoh: 36.5"
                  }
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-primary-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface TrackerCardProps {
  title: string;
  value: string;
  unit: string;
  status: string;
  icon: React.ReactNode;
  color: "rose" | "blue" | "emerald" | "purple" | "amber";
}

function TrackerCard({ title, value, unit, status, icon, color }: TrackerCardProps) {
  const colorMap: Record<"rose" | "blue" | "emerald" | "purple" | "amber", string> = {
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
  };

  return (
    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-col justify-between h-36 hover:border-gray-200 transition">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>{icon}</div>
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
