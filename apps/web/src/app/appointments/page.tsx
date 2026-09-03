"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  Plus,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  CalendarCheck2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { appointmentsApi, Appointment } from "@/lib/api/appointments";
import { toast } from "sonner";
import Link from "next/link";

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  // Reschedule state
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
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
          appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
          appointmentTime: "10:00",
          status: "CONFIRMED",
          notes: "Kontrol keluhan asam lambung dan evaluasi obat",
          doctor: {
            id: "doc-1",
            specialization: "Spesialis Penyakit Dalam",
            user: { name: "dr. Andi Setiawan, Sp.PD" },
            clinic: { name: "Klinik Cabang Pusat" },
          },
          queue: { queueNumber: 4, status: "WAITING" },
        },
        {
          id: "apt-2",
          patientId: "pat-1",
          doctorId: "doc-2",
          appointmentDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          appointmentTime: "14:30",
          status: "COMPLETED",
          notes: "Pemeriksaan flu dan batuk berdahak",
          doctor: {
            id: "doc-2",
            specialization: "Dokter Umum",
            user: { name: "dr. Rina Wijaya" },
            clinic: { name: "Klinik Cabang Barat" },
          },
        },
      ]);
    }
    setLoading(false);
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin membatalkan janji temu ini?")) return;
    try {
      const res = await appointmentsApi.update(id, { status: "CANCELLED" });
      if (res.success) {
        toast.success("Janji temu berhasil dibatalkan");
        fetchAppointments();
      } else {
        toast.error("Gagal membatalkan janji temu");
      }
    } catch {
      toast.error("Terjadi kendala jaringan");
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment || !newDate) {
      toast.error("Silakan pilih tanggal baru");
      return;
    }

    setSubmitting(true);
    try {
      const res = await appointmentsApi.update(selectedAppointment.id, {
        appointmentDate: newDate,
        appointmentTime: newTime,
        status: "CONFIRMED",
      });

      if (res.success) {
        toast.success("Jadwal janji temu berhasil diperbarui!");
        setRescheduleModalOpen(false);
        fetchAppointments();
      } else {
        toast.error(res.error?.message || "Gagal mengubah jadwal");
      }
    } catch {
      toast.error("Terjadi kendala saat mengubah jadwal");
    } finally {
      setSubmitting(false);
    }
  };

  const upcomingList = appointments.filter((a) =>
    ["CONFIRMED", "PENDING", "CHECKED_IN"].includes(a.status),
  );
  const historyList = appointments.filter((a) =>
    ["COMPLETED", "CANCELLED", "NO_SHOW"].includes(a.status),
  );

  const displayedList = activeTab === "upcoming" ? upcomingList : historyList;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Manajemen Janji Temu & Konsultasi</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Janji Temu Saya
          </h1>
          <p className="text-xs text-slate-500">
            Pantau status antrean aktif, ubah jadwal, dan lihat riwayat konsultasi medis
          </p>
        </div>

        <Link
          href="/appointments/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" /> Booking Janji Temu Baru
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "upcoming" ? "bg-white text-emerald-950 shadow-2xs" : "text-slate-600"
          }`}
        >
          Mendatang ({upcomingList.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === "history" ? "bg-white text-emerald-950 shadow-2xs" : "text-slate-600"
          }`}
        >
          Riwayat ({historyList.length})
        </button>
      </div>

      {/* Appointment Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((n) => (
            <div key={n} className="bg-white p-5 rounded-3xl border border-slate-200 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : displayedList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Tidak ada janji temu</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {activeTab === "upcoming"
              ? "Anda belum memiliki jadwal janji temu mendatang."
              : "Belum ada riwayat janji temu yang tercatat."}
          </p>
          {activeTab === "upcoming" && (
            <Link
              href="/appointments/new"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-xs"
            >
              <CalendarCheck2 className="w-4 h-4" /> Jadwalkan Sekarang
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedList.map((apt) => {
            const formattedDate = new Date(apt.appointmentDate).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={apt.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden hover:border-emerald-300 transition"
              >
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{formattedDate}</span>
                    <span className="text-slate-300">•</span>
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{apt.appointmentTime} WIB</span>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                      apt.status === "CONFIRMED"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : apt.status === "COMPLETED"
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : apt.status === "CANCELLED"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    {apt.status === "CONFIRMED"
                      ? "Terkonfirmasi"
                      : apt.status === "COMPLETED"
                      ? "Selesai"
                      : apt.status === "CANCELLED"
                      ? "Dibatalkan"
                      : apt.status}
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900">
                            {apt.doctor?.user?.name || "Dokter Klinik"}
                          </h3>
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        </div>
                        <p className="text-xs text-emerald-700 font-semibold mt-0.5">
                          {apt.doctor?.specialization || "Dokter Spesialis"}
                        </p>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {apt.doctor?.clinic?.name || "Klinik Zavora Life"}
                        </p>
                      </div>
                    </div>

                    {apt.queue && (
                      <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl text-center shrink-0">
                        <p className="text-[9px] uppercase font-bold text-emerald-800">No. Antrean</p>
                        <p className="text-lg font-black text-emerald-950">#{apt.queue.queueNumber}</p>
                      </div>
                    )}
                  </div>

                  {apt.notes && (
                    <div className="bg-slate-50 p-3 rounded-2xl text-xs text-slate-700 border border-slate-100">
                      <span className="font-semibold text-slate-900">Keluhan Pasien:</span> {apt.notes}
                    </div>
                  )}

                  {/* Actions for upcoming appointments */}
                  {["CONFIRMED", "PENDING"].includes(apt.status) && (
                    <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setNewDate(apt.appointmentDate.split("T")[0]);
                          setNewTime(apt.appointmentTime);
                          setRescheduleModalOpen(true);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-emerald-600" /> Reschedule
                      </button>

                      <button
                        onClick={() => handleCancel(apt.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Batalkan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Reschedule Janji Temu</h3>
              <button
                onClick={() => setRescheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Tanggal Baru
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Jam Konsultasi
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="09:00">09:00 WIB</option>
                  <option value="10:00">10:00 WIB</option>
                  <option value="11:00">11:00 WIB</option>
                  <option value="13:30">13:30 WIB</option>
                  <option value="15:00">15:00 WIB</option>
                  <option value="16:30">16:30 WIB</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 shadow-xs"
                >
                  {submitting ? "Menyimpan..." : "Konfirmasi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
