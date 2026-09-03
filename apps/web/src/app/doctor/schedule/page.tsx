"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Calendar, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  maxPatients: number;
}

export default function DoctorSchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<DaySchedule[]>([
    { dayOfWeek: 1, dayName: "Senin", isActive: true, startTime: "08:00", endTime: "16:00", maxPatients: 20 },
    { dayOfWeek: 2, dayName: "Selasa", isActive: true, startTime: "08:00", endTime: "16:00", maxPatients: 20 },
    { dayOfWeek: 3, dayName: "Rabu", isActive: true, startTime: "08:00", endTime: "16:00", maxPatients: 20 },
    { dayOfWeek: 4, dayName: "Kamis", isActive: true, startTime: "08:00", endTime: "16:00", maxPatients: 20 },
    { dayOfWeek: 5, dayName: "Jumat", isActive: true, startTime: "08:30", endTime: "15:00", maxPatients: 15 },
    { dayOfWeek: 6, dayName: "Sabtu", isActive: false, startTime: "09:00", endTime: "13:00", maxPatients: 10 },
    { dayOfWeek: 0, dayName: "Minggu", isActive: false, startTime: "09:00", endTime: "12:00", maxPatients: 5 },
  ]);

  const [saving, setSaving] = useState(false);

  const toggleDay = (index: number) => {
    setSchedules((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, isActive: !s.isActive } : s)),
    );
  };

  const updateSchedule = (index: number, field: keyof DaySchedule, value: any) => {
    setSchedules((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, [field]: value } : s)),
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Jadwal praktek dokter berhasil diperbarui!");
    }, 600);
  };

  return (
    <div className="p-4 space-y-5 pb-28 bg-gray-50 min-h-screen">
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
            <h1 className="text-lg font-bold text-gray-900">Manajemen Jadwal Praktek</h1>
            <p className="text-xs text-gray-500">Atur jam praktek & kuota pasien harian</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-sm transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex items-start gap-3">
        <Clock className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
        <p className="text-xs text-primary-900 leading-relaxed">
          Pasien hanya dapat membuat janji temu pada hari dan jam aktif yang telah Anda tetapkan di bawah ini.
        </p>
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {schedules.map((schedule, idx) => (
          <div
            key={schedule.dayOfWeek}
            className={`p-4 rounded-3xl border transition shadow-xs ${
              schedule.isActive
                ? "bg-white border-gray-100"
                : "bg-gray-100/70 border-gray-200 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`day-${schedule.dayOfWeek}`}
                  checked={schedule.isActive}
                  onChange={() => toggleDay(idx)}
                  className="w-4 h-4 text-primary-600 rounded-sm focus:ring-primary-500 cursor-pointer"
                />
                <label
                  htmlFor={`day-${schedule.dayOfWeek}`}
                  className="text-sm font-bold text-gray-900 cursor-pointer"
                >
                  {schedule.dayName}
                </label>
              </div>

              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  schedule.isActive
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {schedule.isActive ? "Buka Praktek" : "Libur"}
              </span>
            </div>

            {schedule.isActive && (
              <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={schedule.startTime}
                    onChange={(e) => updateSchedule(idx, "startTime", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={schedule.endTime}
                    onChange={(e) => updateSchedule(idx, "endTime", e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 mb-1">
                    Kuota Pasien
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={schedule.maxPatients}
                    onChange={(e) =>
                      updateSchedule(idx, "maxPatients", parseInt(e.target.value) || 1)
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-primary-500 text-center"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
