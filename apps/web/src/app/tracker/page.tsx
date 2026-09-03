"use client";

import { useState } from "react";
import {
  HeartPulse,
  Droplet,
  Plus,
  Activity,
  Thermometer,
  Weight,
  TrendingUp,
  History,
  CheckCircle2,
  Share2,
  Calendar,
  ArrowLeft,
  FileText,
  Moon,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface VitalLog {
  id: string;
  date: string;
  type: string;
  value: string;
  unit: string;
  status: "Normal" | "Optimal" | "Stabil" | "Waspada";
}

export default function HealthMonitoringPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"metrics" | "history">("metrics");

  // Vitals State
  const [bloodPressure, setBloodPressure] = useState("120/80");
  const [bloodSugar, setBloodSugar] = useState("95");
  const [heartRate, setHeartRate] = useState("72");
  const [weight, setWeight] = useState("68.5");
  const [sleep, setSleep] = useState("7.5");
  const [temperature, setTemperature] = useState("36.6");

  // Form State
  const [formType, setFormType] = useState<"bp" | "sugar" | "hr" | "weight" | "sleep" | "temp">("bp");
  const [formValue, setFormValue] = useState("");

  const [logs, setLogs] = useState<VitalLog[]>([
    { id: "1", date: "Hari ini, 08:30", type: "Tekanan Darah", value: "120/80", unit: "mmHg", status: "Optimal" },
    { id: "2", date: "Hari ini, 08:30", type: "Gula Darah Puasa", value: "95", unit: "mg/dL", status: "Normal" },
    { id: "3", date: "Kemarin, 21:00", type: "Detak Jantung", value: "72", unit: "bpm", status: "Optimal" },
    { id: "4", date: "Kemarin, 07:00", type: "Berat Badan", value: "68.5", unit: "kg", status: "Stabil" },
    { id: "5", date: "2 hari lalu", type: "Tidur Semalam", value: "7.5", unit: "jam", status: "Normal" },
    { id: "6", date: "2 hari lalu", type: "Suhu Tubuh", value: "36.6", unit: "°C", status: "Normal" },
  ]);

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValue) {
      toast.error("Silakan masukkan nilai parameter");
      return;
    }

    const nowStr = "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    if (formType === "bp") {
      setBloodPressure(formValue);
      setLogs((prev) => [
        { id: Date.now().toString(), date: nowStr, type: "Tekanan Darah", value: formValue, unit: "mmHg", status: "Optimal" },
        ...prev,
      ]);
    } else if (formType === "sugar") {
      setBloodSugar(formValue);
      setLogs((prev) => [
        { id: Date.now().toString(), date: nowStr, type: "Gula Darah", value: formValue, unit: "mg/dL", status: "Normal" },
        ...prev,
      ]);
    } else if (formType === "hr") {
      setHeartRate(formValue);
      setLogs((prev) => [
        { id: Date.now().toString(), date: nowStr, type: "Detak Jantung", value: formValue, unit: "bpm", status: "Optimal" },
        ...prev,
      ]);
    } else if (formType === "weight") {
      setWeight(formValue);
      setLogs((prev) => [
        { id: Date.now().toString(), date: nowStr, type: "Berat Badan", value: formValue, unit: "kg", status: "Stabil" },
        ...prev,
      ]);
    } else if (formType === "sleep") {
      setSleep(formValue);
      setLogs((prev) => [
        { id: Date.now().toString(), date: nowStr, type: "Tidur", value: formValue, unit: "jam", status: "Normal" },
        ...prev,
      ]);
    } else if (formType === "temp") {
      setTemperature(formValue);
      setLogs((prev) => [
        { id: Date.now().toString(), date: nowStr, type: "Suhu Tubuh", value: formValue, unit: "°C", status: "Normal" },
        ...prev,
      ]);
    }

    toast.success("Catatan tanda vital berhasil disimpan!");
    setModalOpen(false);
    setFormValue("");
  };

  const handleExportSummary = () => {
    toast.success("Ringkasan data kesehatan siap dibagikan ke dokter!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Health Monitoring & Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Monitoring Kesehatan Harian
          </h1>
          <p className="text-xs text-slate-500">
            Pantau perkembangan tanda vital, tren mingguan, dan riwayat klinis Anda
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <button
            onClick={handleExportSummary}
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
          >
            <Share2 className="w-4 h-4 text-emerald-600" /> Ekspor ke Dokter
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Catat Vital Baru
          </button>
        </div>
      </div>

      {/* Health Overview Summary Banner */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <HeartPulse className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Status Keseluruhan
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Kondisi Vital: Normal & Stabil
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
              Semua parameter pengukuran berada di dalam rentang klinis yang direkomendasikan. Pertahankan pola hidrasi dan jadwal istirahat.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-6 self-stretch md:self-auto justify-around">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Skor Kebugaran</span>
            <span className="text-xl font-black text-emerald-700">92 / 100</span>
          </div>
          <div className="border-l border-slate-200 pl-6">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Update Terakhir</span>
            <span className="text-xs font-bold text-slate-800">Hari ini, 08:30</span>
          </div>
        </div>
      </section>

      {/* Tabs Switcher */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("metrics")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "metrics" ? "bg-white text-emerald-950 shadow-2xs" : "text-slate-600"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Metrik & Tren
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === "history" ? "bg-white text-emerald-950 shadow-2xs" : "text-slate-600"
          }`}
        >
          <History className="w-3.5 h-3.5" /> Riwayat Log ({logs.length})
        </button>
      </div>

      {activeTab === "metrics" ? (
        <div className="space-y-6">
          {/* 6 Key Vital Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <MetricCard
              title="Tekanan Darah"
              value={bloodPressure}
              unit="mmHg"
              status="Optimal"
              icon={<HeartPulse className="w-4 h-4 text-emerald-600" />}
              bgColor="bg-emerald-50"
            />
            <MetricCard
              title="Gula Darah"
              value={bloodSugar}
              unit="mg/dL"
              status="Normal"
              icon={<Droplet className="w-4 h-4 text-blue-600" />}
              bgColor="bg-blue-50"
            />
            <MetricCard
              title="Detak Jantung"
              value={heartRate}
              unit="bpm"
              status="Optimal"
              icon={<Activity className="w-4 h-4 text-purple-600" />}
              bgColor="bg-purple-50"
            />
            <MetricCard
              title="Berat Badan"
              value={weight}
              unit="kg"
              status="Stabil"
              icon={<Weight className="w-4 h-4 text-slate-700" />}
              bgColor="bg-slate-100"
            />
            <MetricCard
              title="Tidur Semalam"
              value={sleep}
              unit="jam"
              status="Normal"
              icon={<Moon className="w-4 h-4 text-amber-600" />}
              bgColor="bg-amber-50"
            />
            <MetricCard
              title="Suhu Tubuh"
              value={temperature}
              unit="°C"
              status="Normal"
              icon={<Thermometer className="w-4 h-4 text-rose-600" />}
              bgColor="bg-rose-50"
            />
          </div>

          {/* Minimalist Weekly Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chart 1: Blood Pressure Trend */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tren Tekanan Darah (Sistolik / Diastolik)</h3>
                  <p className="text-[11px] text-slate-500">Rata-rata 7 hari: 120/80 mmHg</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  Stabil
                </span>
              </div>

              <div className="h-40 flex items-end justify-between gap-3 pt-4 border-b border-slate-100 pb-2">
                {[
                  { day: "Sen", s: 122, d: 80 },
                  { day: "Sel", s: 118, d: 78 },
                  { day: "Rab", s: 120, d: 82 },
                  { day: "Kam", s: 125, d: 80 },
                  { day: "Jum", s: 119, d: 79 },
                  { day: "Sab", s: 121, d: 81 },
                  { day: "Min", s: 120, d: 80 },
                ].map((item, idx) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[9px] font-bold text-slate-600">{item.s}</span>
                    <div
                      className={`w-full max-w-[20px] rounded-t-md transition-all ${
                        idx === 6 ? "bg-emerald-600" : "bg-emerald-300"
                      }`}
                      style={{ height: `${(item.s / 140) * 100}%` }}
                    ></div>
                    <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Blood Glucose Trend */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tren Gula Darah Puasa (mg/dL)</h3>
                  <p className="text-[11px] text-slate-500">Rentang target optimal: 70 - 100 mg/dL</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                  Terkontrol
                </span>
              </div>

              <div className="h-40 flex items-end justify-between gap-3 pt-4 border-b border-slate-100 pb-2">
                {[
                  { day: "Sen", val: 92 },
                  { day: "Sel", val: 96 },
                  { day: "Rab", val: 89 },
                  { day: "Kam", val: 98 },
                  { day: "Jum", val: 94 },
                  { day: "Sab", val: 91 },
                  { day: "Min", val: 95 },
                ].map((item, idx) => (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[9px] font-bold text-slate-600">{item.val}</span>
                    <div
                      className={`w-full max-w-[20px] rounded-t-md transition-all ${
                        idx === 6 ? "bg-blue-600" : "bg-blue-300"
                      }`}
                      style={{ height: `${(item.val / 120) * 100}%` }}
                    ></div>
                    <span className="text-[10px] font-bold text-slate-400">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* History Logs Tab */
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900">Log Pengukuran Terkini</h3>
            <span className="text-xs text-slate-400">{logs.length} catatan tersimpan</span>
          </div>

          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-900">{log.type}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {log.date}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-black text-slate-900">
                    {log.value} <span className="text-[10px] font-medium text-slate-500">{log.unit}</span>
                  </p>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Catat Tanda Vital Baru</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMetric} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parameter Kesehatan
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="bp">Tekanan Darah (mmHg)</option>
                  <option value="sugar">Gula Darah Sewaktu (mg/dL)</option>
                  <option value="hr">Detak Jantung (bpm)</option>
                  <option value="weight">Berat Badan (kg)</option>
                  <option value="sleep">Durasi Tidur (jam)</option>
                  <option value="temp">Suhu Tubuh (°C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nilai Pengukuran
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    formType === "bp"
                      ? "Contoh: 120/80"
                      : formType === "sugar"
                      ? "Contoh: 95"
                      : formType === "hr"
                      ? "Contoh: 72"
                      : formType === "weight"
                      ? "Contoh: 68.5"
                      : formType === "sleep"
                      ? "Contoh: 7.5"
                      : "Contoh: 36.6"
                  }
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
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

function MetricCard({
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
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between h-32 hover:border-emerald-300 transition">
      <div className="flex items-start justify-between">
        <div className={`p-1.5 rounded-lg ${bgColor}`}>{icon}</div>
        <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
          {status}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-medium text-slate-500">{title}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-lg font-black text-slate-900">{value}</span>
          <span className="text-[10px] font-medium text-slate-400">{unit}</span>
        </div>
      </div>
    </div>
  );
}
