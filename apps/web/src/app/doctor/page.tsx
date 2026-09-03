"use client";

import { useState, useEffect } from "react";
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  Calendar,
  Settings,
  Play,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { appointmentsApi, Appointment } from "@/lib/api/appointments";
import { toast } from "sonner";
import Link from "next/link";

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorQueue();
  }, []);

  const fetchDoctorQueue = async () => {
    setLoading(true);
    const res = await appointmentsApi.getAll({ limit: 50 });
    if (res.success && res.data) {
      setAppointments(res.data);
    } else {
      // Fallback mock doctor queue
      setAppointments([
        {
          id: "apt-1",
          patientId: "pat-1",
          doctorId: "doc-1",
          appointmentDate: new Date().toISOString(),
          appointmentTime: "09:00",
          status: "CHECKED_IN",
          notes: "Nyeri dada ringan setelah aktivitas berat",
          patient: {
            id: "pat-1",
            gender: "Laki-laki",
            user: { name: "Budi Santoso", phone: "08123456789" },
          },
          queue: { queueNumber: 1, status: "WAITING" },
        },
        {
          id: "apt-2",
          patientId: "pat-2",
          doctorId: "doc-1",
          appointmentDate: new Date().toISOString(),
          appointmentTime: "09:30",
          status: "CONFIRMED",
          notes: "Kontrol diabetes rutin dan evaluasi gula darah puasa",
          patient: {
            id: "pat-2",
            gender: "Perempuan",
            user: { name: "Siti Rahma", phone: "08198765432" },
          },
          queue: { queueNumber: 2, status: "WAITING" },
        },
        {
          id: "apt-3",
          patientId: "pat-3",
          doctorId: "doc-1",
          appointmentDate: new Date().toISOString(),
          appointmentTime: "08:30",
          status: "COMPLETED",
          notes: "Pemeriksaan ISPA & batuk berdahak",
          patient: {
            id: "pat-3",
            gender: "Laki-laki",
            user: { name: "Ahmad Fauzi", phone: "08112233445" },
          },
          queue: { queueNumber: 0, status: "COMPLETED" },
        },
      ]);
    }
    setLoading(false);
  };

  const handleCallPatient = (queueNum: number, name: string) => {
    toast.success(`Memanggil nomor antrean #${queueNum} (${name})`);
  };

  const waitingCount = appointments.filter((a) => ["CONFIRMED", "CHECKED_IN", "PENDING"].includes(a.status)).length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="p-4 space-y-5 pb-24 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Portal Dokter</h1>
            <p className="text-xs text-gray-500">KlinikSehat Telemedicine & EMR</p>
          </div>
        </div>

        <Link
          href="/doctor/schedule"
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition shadow-xs"
        >
          <Calendar className="w-4 h-4 text-primary-600" /> Atur Jadwal
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Pasien</p>
          <p className="text-2xl font-black text-gray-900 mt-0.5">{appointments.length}</p>
        </div>
        <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-100 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Menunggu</p>
          <p className="text-2xl font-black text-amber-800 mt-0.5">{waitingCount}</p>
        </div>
        <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Selesai</p>
          <p className="text-2xl font-black text-emerald-800 mt-0.5">{completedCount}</p>
        </div>
      </div>

      {/* Live Queue Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary-600" />
            Antrean Pasien Hari Ini
          </h2>
          <span className="text-[11px] font-semibold text-gray-400">Real-time</span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white p-5 rounded-3xl border border-gray-100 animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-gray-100 p-6 space-y-2">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-xs font-bold text-gray-700">Tidak ada antrean saat ini</p>
            <p className="text-[11px] text-gray-500">Semua pasien yang terjadwal telah selesai diperiksa.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => {
              const isCompleted = apt.status === "COMPLETED";
              const patientName = apt.patient?.user?.name || "Pasien";

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-3xl border shadow-xs transition ${
                    isCompleted
                      ? "bg-gray-50/70 border-gray-200 opacity-75"
                      : "bg-white border-gray-100 hover:border-primary-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center font-bold ${
                          isCompleted
                            ? "bg-gray-200 text-gray-600"
                            : "bg-primary-50 border border-primary-200 text-primary-700"
                        }`}
                      >
                        <span className="text-[8px] uppercase">Antrean</span>
                        <span className="text-base font-black">
                          #{apt.queue?.queueNumber || "-"}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">{patientName}</h3>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span>{apt.appointmentTime} WIB</span>
                          <span>•</span>
                          <span>{apt.patient?.gender || "Pasien"}</span>
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        isCompleted
                          ? "bg-gray-200 text-gray-600"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {isCompleted ? "Selesai" : "Menunggu"}
                    </span>
                  </div>

                  {apt.notes && (
                    <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl mt-3">
                      <span className="font-semibold text-gray-700">Keluhan:</span> {apt.notes}
                    </p>
                  )}

                  {!isCompleted && (
                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => handleCallPatient(apt.queue?.queueNumber || 1, patientName)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Panggil
                      </button>

                      <Link
                        href={`/doctor/consultations/${apt.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Mulai Periksa
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
