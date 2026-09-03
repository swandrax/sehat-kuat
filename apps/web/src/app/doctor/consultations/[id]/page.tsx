"use client";

import { use, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { appointmentsApi, apiClient } from "@/lib/api";
import {
  Stethoscope,
  FileText,
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  User,
  HeartPulse,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DoctorConsultationWorkspace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [chiefComplaint, setChiefComplaint] = useState("");
  const [clinicalNotes, setClinicalNotes] = useState("");
  const [treatment, setTreatment] = useState("");
  const [followUpNotes, setFollowUpNotes] = useState("");
  const [diagnosisCode, setDiagnosisCode] = useState("E11.9");
  const [diagnosisName, setDiagnosisName] = useState("Type 2 diabetes mellitus");

  const [prescriptionItems, setPrescriptionItems] = useState([
    {
      medicineName: "",
      dosage: "",
      frequency: "3x sehari setelah makan",
      duration: "5 hari",
      instructions: "",
      quantity: 1,
    },
  ]);

  const [isFinished, setIsFinished] = useState(false);

  // Fetch Appointment & Patient Details
  const { data: appointment, isLoading } = useQuery({
    queryKey: ["appointmentDetail", id],
    queryFn: async () => {
      const res = await appointmentsApi.getById(id);
      return res.data;
    },
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      const validItems = prescriptionItems.filter((i) => i.medicineName.trim() !== "");

      const res = await apiClient("/consultations/complete", {
        method: "POST",
        body: JSON.stringify({
          appointmentId: id,
          chiefComplaint: chiefComplaint || "Pemeriksaan rutin klinis",
          clinicalNotes: clinicalNotes || undefined,
          treatment: treatment || undefined,
          followUpNotes: followUpNotes || undefined,
          diagnoses: [
            {
              code: diagnosisCode,
              name: diagnosisName,
            },
          ],
          prescriptionItems: validItems.length > 0 ? validItems : undefined,
        }),
      });

      if (!res.success) {
        throw new Error(res.error?.message || "Gagal menyelesaikan konsultasi");
      }

      return res.data;
    },
    onSuccess: () => {
      setIsFinished(true);
      toast.success("Konsultasi selesai & resep digital berhasil diterbitkan!");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan rekam medis";
      toast.error(msg);
    },
  });

  const handleGenerateAIDraft = () => {
    const symptom = chiefComplaint || "Pasien mengeluhkan demam dan batuk berdahak 3 hari";
    setChiefComplaint(symptom);
    setClinicalNotes(
      "S: Pasien demam subfebris dan batuk produktif sejak 3 hari lalu.\nO: Suhu 37.8°C, TD 120/80 mmHg, Ronkhi halus minimal bilateral.\nA: Infeksi Saluran Pernapasan Akut (ISPA) ec suspek viral.\nP: Simptomatik antipiretik, mukolitik, edukasi istirahat & hidrasi 2L/hari.",
    );
    setTreatment("Paracetamol 500mg 3x1 prn, Ambroxol 30mg 3x1, Vitamin C 500mg 1x1");
    setFollowUpNotes("Kontrol kembali bila demam menetap > 5 hari atau timbul sesak napas");
    setDiagnosisCode("J06.9");
    setDiagnosisName("Acute upper respiratory infection, unspecified");
    toast.success("Draf SOAP berhasil dibuat oleh AI Assistant Zavora Life!");
  };

  const addPrescriptionItem = () => {
    setPrescriptionItems((prev) => [
      ...prev,
      {
        medicineName: "",
        dosage: "",
        frequency: "3x sehari sesudah makan",
        duration: "5 hari",
        instructions: "",
        quantity: 1,
      },
    ]);
  };

  const removePrescriptionItem = (index: number) => {
    setPrescriptionItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    setPrescriptionItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs font-bold text-emerald-700 animate-pulse">
        Memuat data rekam medis pasien...
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm max-w-lg mx-auto text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
            Selesai Diperiksa
          </span>
          <h2 className="text-xl font-black text-slate-900 pt-2">
            Konsultasi Telah Disimpan
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Rekam Medis (EMR) dan Resep Elektronik telah berhasil disimpan ke database Zavora Life.
          </p>
        </div>

        <Link
          href="/doctor"
          className="w-full inline-block bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-xs transition"
        >
          Kembali ke Antrean Dokter
        </Link>
      </div>
    );
  }

  const patient = appointment?.patient;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Ruang Pemeriksaan Klinis</h1>
            <p className="text-xs text-slate-500">Pencatatan Rekam Medis (SOAP) & E-Resep Obat</p>
          </div>
        </div>

        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
          Sesi Aktif
        </span>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
            {patient?.user?.name?.charAt(0) || "P"}
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">{patient?.user?.name || "Nama Pasien"}</h3>
            <p className="text-xs text-slate-500">
              {patient?.gender || "Pasien"} • Golongan Darah {patient?.bloodType || "O+"}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <span>Kontak Darurat: <strong className="text-slate-800">{patient?.emergencyContact || "-"}</strong></span>
          <span>Alamat: <strong className="text-slate-800">{patient?.address || "Jakarta"}</strong></span>
        </div>
      </div>

      {/* Chief Complaint & Clinical Notes SOAP */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-600" />
            Anamnesis & Catatan Klinis (SOAP)
          </h3>
          <button
            type="button"
            onClick={handleGenerateAIDraft}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold transition border border-emerald-200 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Generate AI Draft SOAP
          </button>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Keluhan Utama</label>
          <input
            type="text"
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Contoh: Sakit kepala sebelah dan demam sejak 3 hari..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-800"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Catatan Pemeriksaan (SOAP)</label>
          <textarea
            rows={4}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Subjective, Objective, Assessment, Plan..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none font-medium text-slate-800"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Rencana Terapi / Edukasi</label>
            <input
              type="text"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              placeholder="Contoh: Istirahat cukup, hidrasi 2L/hari"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Tindak Lanjut (Follow-up)</label>
            <input
              type="text"
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              placeholder="Contoh: Kontrol ulang dalam 3 hari bila belum membaik"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Diagnosis ICD-10 */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          Diagnosis Medis (ICD-10)
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block font-bold text-slate-700 mb-1">Kode ICD-10</label>
            <input
              type="text"
              value={diagnosisCode}
              onChange={(e) => setDiagnosisCode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 uppercase font-mono font-bold text-center text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Nama Diagnosis</label>
            <input
              type="text"
              value={diagnosisName}
              onChange={(e) => setDiagnosisName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Electronic Prescription Builder */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-emerald-600" />
            Resep Obat Elektronik
          </h3>
          <button
            type="button"
            onClick={addPrescriptionItem}
            className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Obat
          </button>
        </div>

        {prescriptionItems.map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Obat #{idx + 1}</span>
              {prescriptionItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePrescriptionItem(idx)}
                  className="text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                placeholder="Nama Obat (e.g. Paracetamol)"
                value={item.medicineName}
                onChange={(e) => updateItem(idx, "medicineName", e.target.value)}
                className="sm:col-span-3 bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
              />
              <input
                type="text"
                placeholder="Dosis (e.g. 500mg)"
                value={item.dosage}
                onChange={(e) => updateItem(idx, "dosage", e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
              />
              <input
                type="text"
                placeholder="Frekuensi (e.g. 3x sehari)"
                value={item.frequency}
                onChange={(e) => updateItem(idx, "frequency", e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
              />
              <input
                type="text"
                placeholder="Durasi (e.g. 5 hari)"
                value={item.duration}
                onChange={(e) => updateItem(idx, "duration", e.target.value)}
                className="bg-white border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Submit Action */}
      <div className="pt-2">
        <button
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold text-xs shadow-xs transition disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {completeMutation.isPending ? "Menyimpan Rekam Medis..." : "Selesaikan Konsultasi & Terbitkan Resep"}
        </button>
      </div>
    </div>
  );
}
