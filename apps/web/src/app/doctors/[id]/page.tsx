"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { doctorsApi, appointmentsApi, authApi, type Appointment } from "@/lib/api";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

interface DoctorSchedule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxPatients?: number;
}

type QueueInfo = NonNullable<Appointment["queue"]>;

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function DoctorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  const [appointmentDate, setAppointmentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [successQueue, setSuccessQueue] = useState<QueueInfo | null>(null);

  // 1. Fetch Doctor Details
  const { data: doctor, isLoading: isDocLoading } = useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => {
      const res = await doctorsApi.getById(id);
      return res.data ?? null;
    },
  });

  // 2. Fetch Current User Profile
  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data ?? null;
    },
  });

  // 3. Appointment Booking Mutation
  const bookingMutation = useMutation({
    mutationFn: async (): Promise<Appointment> => {
      if (!currentUser?.patient?.id) {
        throw new Error("Silakan masuk sebagai pasien untuk membuat janji temu");
      }
      if (!selectedSchedule) {
        throw new Error("Pilih jadwal praktik terlebih dahulu");
      }

      const res = await appointmentsApi.create({
        patientId: currentUser.patient.id,
        doctorId: id,
        clinicId: doctor?.clinicId,
        scheduleId: selectedSchedule.id,
        appointmentDate: appointmentDate,
        appointmentTime: selectedSchedule.startTime,
        notes: notes || undefined,
      });

      if (!res.success || !res.data) {
        throw new Error(res.error?.message || "Gagal membuat janji temu");
      }

      return res.data;
    },
    onSuccess: (data: Appointment) => {
      if (data?.queue) {
        setSuccessQueue(data.queue);
      }
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "Gagal membuat janji";
      alert(message);
    },
  });

  if (isDocLoading) {
    return (
      <div className="p-6 text-center text-sm text-gray-500 animate-pulse">
        Memuat detail dokter...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-6 text-center text-sm text-gray-500">
        Dokter tidak ditemukan.{" "}
        <Link href="/doctors" className="text-primary-600 font-semibold underline">
          Kembali
        </Link>
      </div>
    );
  }

  // Success Confirmation Screen
  if (successQueue) {
    return (
      <div className="p-6 text-center space-y-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 animate-bounce">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Janji Temu Berhasil!</h2>
          <p className="text-sm text-gray-500">
            Jadwal Anda telah dikonfirmasi dengan {doctor.user?.name}
          </p>
        </div>

        {/* Queue Ticket Card */}
        <div className="w-full bg-gradient-to-br from-primary-600 to-primary-800 p-6 rounded-3xl text-white shadow-xl space-y-4">
          <p className="text-xs font-semibold tracking-wider text-primary-200 uppercase">
            Nomor Antrean Anda
          </p>
          <div className="text-5xl font-black tracking-tight">
            #{successQueue.queueNumber}
          </div>
          <div className="pt-4 border-t border-primary-500/30 flex justify-between text-xs text-primary-100">
            <span>Tanggal: {appointmentDate}</span>
            <span>Jam: {selectedSchedule?.startTime}</span>
          </div>
        </div>

        <div className="w-full space-y-3 pt-4">
          <Link
            href="/"
            className="block w-full bg-primary-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-primary-700 transition"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Top Navigation */}
      <div className="flex items-center gap-3">
        <Link
          href="/doctors"
          className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-base font-bold text-gray-900">Detail & Jadwal Dokter</h1>
      </div>

      {/* Doctor Profile Banner */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-3xl shadow-md shrink-0">
            {doctor.user?.name?.charAt(0) || "D"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-gray-900 text-base">{doctor.user?.name}</h2>
            </div>
            <p className="text-xs font-medium text-primary-600 mt-0.5">
              {doctor.specialization}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>{doctor.licenseNumber || "SIP Terverifikasi"}</span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
            <Award className="w-4 h-4 mx-auto text-primary-500 mb-1" />
            <span className="font-bold text-gray-900 block">{doctor.experienceYears || 5}+ Thn</span>
            <span className="text-[10px] text-gray-400">Pengalaman</span>
          </div>

          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
            <Star className="w-4 h-4 mx-auto text-amber-500 mb-1 fill-amber-400" />
            <span className="font-bold text-gray-900 block">4.9/5.0</span>
            <span className="text-[10px] text-gray-400">Rating Pasien</span>
          </div>

          <div className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
            <Users className="w-4 h-4 mx-auto text-emerald-500 mb-1" />
            <span className="font-bold text-gray-900 block">1.2k+</span>
            <span className="text-[10px] text-gray-400">Pasien</span>
          </div>
        </div>
      </div>

      {/* Bio & Education */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-gray-800 text-sm">Tentang Dokter</h3>
        <p className="text-gray-600 leading-relaxed">
          {doctor.bio || "Dokter berpengalaman yang berdedikasi memberikan layanan kesehatan komprehensif."}
        </p>

        {doctor.education && (
          <div className="flex items-center gap-2 pt-2 border-t border-gray-50 text-gray-600">
            <BookOpen className="w-4 h-4 text-primary-500 shrink-0" />
            <span>{doctor.education}</span>
          </div>
        )}

        {doctor.clinic && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
            <span>{doctor.clinic.name} — {doctor.clinic.address}</span>
          </div>
        )}
      </div>

      {/* Schedule Picker */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
          <CalendarIcon className="w-4 h-4 text-primary-600" />
          Pilih Jadwal Praktik
        </h3>

        {/* Date input */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Tanggal Kunjungan
          </label>
          <input
            type="date"
            value={appointmentDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setAppointmentDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-primary-500 font-medium"
          />
        </div>

        {/* Available Schedule Slots */}
        <div className="space-y-1.5 pt-1">
          <label className="block text-xs font-semibold text-gray-700">
            Sesi Waktu Praktik
          </label>
          {doctor.schedules && doctor.schedules.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {doctor.schedules.map((sch: DoctorSchedule) => {
                const isSelected = selectedSchedule?.id === sch.id;
                return (
                  <button
                    key={sch.id}
                    type="button"
                    onClick={() => setSelectedSchedule(sch)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-primary-600 bg-primary-50 text-primary-900 ring-2 ring-primary-500/20 shadow-sm"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="font-bold text-xs">
                      {DAY_NAMES[sch.dayOfWeek]}
                    </div>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-primary-500" />
                      <span>{sch.startTime} - {sch.endTime}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-400 italic">Belum ada jadwal praktik aktif.</p>
          )}
        </div>

        {/* Notes input */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Keluhan Singkat (Opsional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Demam sejak 2 hari yang lalu..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <button
          onClick={() => bookingMutation.mutate()}
          disabled={bookingMutation.isPending || !selectedSchedule}
          className="w-full bg-primary-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-500/20 active:scale-[0.99]"
        >
          {bookingMutation.isPending ? "Memproses Janji Temu..." : "Konfirmasi Buat Janji"}
        </button>
      </div>
    </div>
  );
}
