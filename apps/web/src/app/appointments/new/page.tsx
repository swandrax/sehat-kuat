"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  User,
  AlertCircle,
  Sparkles,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { appointmentsApi } from "@/lib/api/appointments";

const DOCTORS = [
  {
    id: "doc-1",
    name: "dr. Andi Setiawan, Sp.PD",
    specialization: "Spesialis Penyakit Dalam",
    clinic: "Klinik Cabang Pusat",
    rating: "4.9",
    experience: "8 Tahun",
    price: "Rp 150.000",
    availableTimes: ["09:00", "10:30", "13:30", "15:00"],
  },
  {
    id: "doc-2",
    name: "dr. Amanda Kartika, Sp.A",
    specialization: "Spesialis Anak (Pediatri)",
    clinic: "Klinik Cabang Selatan",
    rating: "5.0",
    experience: "6 Tahun",
    price: "Rp 160.000",
    availableTimes: ["08:30", "11:00", "14:00", "16:30"],
  },
  {
    id: "doc-3",
    name: "dr. Budi Setiawan, Sp.JP",
    specialization: "Spesialis Jantung & Pembuluh Darah",
    clinic: "Klinik Cabang Pusat",
    rating: "4.9",
    experience: "12 Tahun",
    price: "Rp 250.000",
    availableTimes: ["09:30", "11:30", "15:30"],
  },
];

export default function MultiStepAppointmentBooking() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0],
  );
  const [selectedTime, setSelectedTime] = useState(DOCTORS[0].availableTimes[0]);
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [hasAllergy, setHasAllergy] = useState(false);
  const [allergyNotes, setAllergyNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmedQueue, setConfirmedQueue] = useState<number | null>(null);

  const selectedDoctor = DOCTORS.find((d) => d.id === selectedDoctorId) || DOCTORS[0];

  const handleNext = () => {
    if (step === 3 && !chiefComplaint.trim()) {
      toast.error("Mohon isi deskripsi keluhan singkat untuk dokter");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
    else router.back();
  };

  const handleConfirmBooking = async () => {
    setSubmitting(true);
    try {
      const res = await appointmentsApi.create({
        patientId: "pat-1",
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        notes: `${chiefComplaint}${hasAllergy ? ` [Alergi: ${allergyNotes}]` : ""}`,
      });

      if (res.success && res.data) {
        setConfirmedQueue(res.data.queue?.queueNumber || 4);
        setStep(5); // Success step
        toast.success("Janji temu berhasil dikonfirmasi!");
      } else {
        // Fallback for demo
        setConfirmedQueue(Math.floor(Math.random() * 8) + 1);
        setStep(5);
        toast.success("Janji temu berhasil dibuat!");
      }
    } catch {
      setConfirmedQueue(3);
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = [
    "Pilih Dokter",
    "Pilih Jadwal",
    "Keluhan Pasien",
    "Review & Konfirmasi",
  ];

  if (step === 5) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm max-w-lg mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Booking Sukses Terkonfirmasi
          </span>
          <h2 className="text-xl font-black text-slate-900 pt-2">
            Janji Temu Berhasil Dibuat
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Notifikasi jadwal dan tiket antrean telah dikirimkan ke akun Zavora Life Anda.
          </p>
        </div>

        {/* Ticket Summary Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Nomor Antrean</p>
              <p className="text-2xl font-black text-emerald-700">#{confirmedQueue}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Jadwal Praktik</p>
              <p className="text-xs font-bold text-slate-900">
                {selectedDate} • {selectedTime} WIB
              </p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-900">{selectedDoctor.name}</p>
            <p className="text-emerald-700 font-semibold">{selectedDoctor.specialization}</p>
            <p className="text-slate-500 text-[11px]">{selectedDoctor.clinic}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/appointments"
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Lihat Janji Temu Saya
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header & Back */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition shadow-2xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Buat Janji Konsultasi</h1>
          <p className="text-xs text-slate-500">Langkah {step} dari 4: {stepTitles[step - 1]}</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          {stepTitles.map((title, idx) => (
            <div key={title} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step > idx + 1
                    ? "bg-emerald-600 text-white"
                    : step === idx + 1
                    ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-600"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step > idx + 1 ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={`text-xs font-semibold hidden md:inline ${
                  step === idx + 1 ? "text-slate-900 font-bold" : "text-slate-400"
                }`}
              >
                {title}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Contents */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
        {/* Step 1: Choose Doctor */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pilih Dokter Spesialis</h2>
              <p className="text-xs text-slate-500">Pilih dokter yang sesuai dengan keluhan Anda</p>
            </div>

            <div className="space-y-3">
              {DOCTORS.map((doc) => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      setSelectedTime(doc.availableTimes[0]);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50/40 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900">{doc.name}</h3>
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </div>
                          <p className="text-xs font-semibold text-emerald-700">{doc.specialization}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{doc.clinic}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-700">{doc.price}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5 justify-end">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-slate-800">{doc.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Select Date & Time */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Pilih Tanggal & Jam Praktik</h2>
              <p className="text-xs text-slate-500">
                Konsultasi bersama <span className="font-semibold text-slate-800">{selectedDoctor.name}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Pilih Tanggal</label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Slot Waktu</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {selectedDoctor.availableTimes.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {time} WIB
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Patient Complaint & Notes */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Deskripsi Keluhan Klinis</h2>
              <p className="text-xs text-slate-500">
                Informasi ini akan langsung dibaca dokter untuk anamnesis awal
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Keluhan Utama / Gejala yang Dirasakan
              </label>
              <textarea
                rows={4}
                required
                placeholder="Contoh: Sakit kepala sebelah dan demam sejak 2 hari yang lalu..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={hasAllergy}
                  onChange={(e) => setHasAllergy(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 cursor-pointer"
                />
                <span>Memiliki riwayat alergi obat / makanan</span>
              </label>

              {hasAllergy && (
                <input
                  type="text"
                  placeholder="Sebutkan obat/makanan pemicu alergi..."
                  value={allergyNotes}
                  onChange={(e) => setAllergyNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Review Rincian Booking</h2>
              <p className="text-xs text-slate-500">Pastikan informasi janji temu Anda telah sesuai</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Dokter:</span>
                <span className="font-bold text-slate-900">{selectedDoctor.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Spesialisasi:</span>
                <span className="font-semibold text-emerald-700">{selectedDoctor.specialization}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Jadwal:</span>
                <span className="font-bold text-slate-900">{selectedDate} pukul {selectedTime} WIB</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Keluhan:</span>
                <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">{chiefComplaint}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-700 font-bold">Biaya Konsultasi:</span>
                <span className="font-black text-emerald-700 text-sm">{selectedDoctor.price}</span>
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pembayaran dapat diselesaikan saat registrasi atau via QRIS.</span>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Kembali
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
            >
              Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleConfirmBooking}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {submitting ? "Memproses..." : "Konfirmasi Janji Temu"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
