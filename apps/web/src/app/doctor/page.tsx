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
  FileText,
  Activity,
  Search,
  Filter,
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
      setAppointments([
        {
          id: "apt-1",
          patientId: "pat-1",
          doctorId: "doc-1",
          appointmentDate: new Date().toISOString(),
          appointmentTime: "09:00",
          status: "CHECKED_IN",
          notes: "Nyeri dada sebelah kiri setelah berolahraga berat",
          patient: {
            id: "pat-1",
            gender: "Laki-laki",
            bloodType: "O+",
            user: { name: "Budi Santoso", phone: "08123456789", email: "budi@pasien.id" },
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
          notes: "Evaluasi rutin gula darah puasa dan kepatuhan minum obat",
          patient: {
            id: "pat-2",
            gender: "Perempuan",
            bloodType: "B+",
            user: { name: "Siti Rahma", phone: "08198765432", email: "siti@pasien.id" },
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
          notes: "Pemeriksaan ISPA & batuk berdahak ringan",
          patient: {
            id: "pat-3",
            gender: "Laki-laki",
            bloodType: "A+",
            user: { name: "Ahmad Fauzi", phone: "08112233445", email: "ahmad@pasien.id" },
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

  const waitingCount = appointments.filter((a) =>
    ["CONFIRMED", "CHECKED_IN", "PENDING"].includes(a.status),
  ).length;
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <span>Dokter Spesialis Portal • Zavora Life</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Dashboard & Antrean Pasien
          </h1>
          <p className="text-xs text-slate-500">
            Kelola jadwal konsultasi, rekam medis klinis, dan antrean telemedisin hari ini
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start">
          <Link
            href="/doctor/schedule"
            className="px-3.5 py-2.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-emerald-600" /> Atur Jadwal Praktik
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Pasien Terjadwal</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{appointments.length}</p>
            <span className="text-[10px] text-slate-500">Hari ini</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Menunggu Diperiksa</span>
            <p className="text-3xl font-black text-amber-700 mt-1">{waitingCount}</p>
            <span className="text-[10px] text-amber-600">Dalam antrean aktif</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Selesai Konsultasi</span>
            <p className="text-3xl font-black text-emerald-700 mt-1">{completedCount}</p>
            <span className="text-[10px] text-emerald-600">Rekam medis tersimpan</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Patient Queue List */}
      <section className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daftar Antrean Pasien Hari Ini</h2>
            <p className="text-xs text-slate-500">Pilih pasien untuk memulai sesi telekonsultasi atau mencatat SOAP EMR</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
            Live Queue Real-Time
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((n) => (
              <div key={n} className="p-5 bg-slate-50 rounded-2xl animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">Tidak ada antrean aktif</p>
            <p className="text-[11px] text-slate-500">Semua pasien terjadwal telah selesai diperiksa.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => {
              const isCompleted = apt.status === "COMPLETED";
              const patientName = apt.patient?.user?.name || "Pasien";

              return (
                <div
                  key={apt.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition shadow-2xs ${
                    isCompleted
                      ? "bg-slate-50/60 border-slate-200 opacity-75"
                      : "bg-white border-slate-200/80 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shrink-0 ${
                          isCompleted
                            ? "bg-slate-200 text-slate-600"
                            : "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        }`}
                      >
                        <span className="text-[8px] uppercase font-semibold">Antrean</span>
                        <span className="text-lg font-black leading-none">
                          #{apt.queue?.queueNumber || "-"}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{patientName}</h3>
                          <span
                            className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                              isCompleted
                                ? "bg-slate-200 text-slate-600"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {isCompleted ? "Selesai" : "Menunggu"}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {apt.appointmentTime} WIB
                          </span>
                          <span>•</span>
                          <span>{apt.patient?.gender || "Pasien"}</span>
                          <span>•</span>
                          <span>Gol. Darah: {apt.patient?.bloodType || "O+"}</span>
                        </p>

                        {apt.notes && (
                          <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl mt-1 border border-slate-100">
                            <span className="font-semibold text-slate-900">Keluhan:</span> {apt.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isCompleted && (
                      <div className="flex items-center gap-2 sm:self-center shrink-0">
                        <button
                          onClick={() => handleCallPatient(apt.queue?.queueNumber || 1, patientName)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <PhoneCall className="w-3.5 h-3.5" /> Panggil
                        </button>
                        <Link
                          href={`/doctor/consultations/${apt.id}`}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 active:scale-95"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Periksa Pasien
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
