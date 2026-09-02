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
} from "lucide-react";
import Link from "next/link";

export default function DoctorConsultationWorkspace({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

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
      frequency: "",
      duration: "",
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
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan rekam medis";
      alert(msg);
    },
  });

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
    return <div className="p-6 text-center text-sm text-gray-500 animate-pulse">Memuat data rekam medis...</div>;
  }

  if (isFinished) {
    return (
      <div className="p-6 text-center space-y-6 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Konsultasi Selesai</h2>
          <p className="text-xs text-gray-500 mt-1">
            Rekam Medis (EMR) dan Resep Elektronik telah berhasil disimpan ke database Neon.
          </p>
        </div>
        <Link
          href="/"
          className="w-full bg-primary-600 text-white py-3 rounded-2xl font-bold text-sm shadow-md"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const patient = appointment?.patient;

  return (
    <div className="p-4 space-y-5 pb-28">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/" className="p-2 rounded-xl bg-gray-100 text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-gray-900">Portal Telekonsultasi Dokter</h1>
          <p className="text-[11px] text-gray-500">Pencatatan Rekam Medis & Resep Digital</p>
        </div>
      </div>

      {/* Patient Information Card */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
            {patient?.user?.name?.charAt(0) || "P"}
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-900">{patient?.user?.name || "Nama Pasien"}</h3>
            <p className="text-xs text-gray-500">{patient?.gender || "Laki-laki"} • Golongan Darah {patient?.bloodType || "O+"}</p>
          </div>
        </div>

        <div className="pt-2 border-t border-gray-50 text-xs text-gray-600 flex justify-between">
          <span>Kontak Darurat: {patient?.emergencyContact || "-"}</span>
          <span>Alamat: {patient?.address || "Jakarta"}</span>
        </div>
      </div>

      {/* Chief Complaint & Clinical Notes */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-primary-600" />
          Anamnesis & Catatan Klinis
        </h3>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Keluhan Utama</label>
          <input
            type="text"
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
            placeholder="Contoh: Sakit kepala dan demam sejak 3 hari"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Catatan Pemeriksaan (SOAP)</label>
          <textarea
            rows={3}
            value={clinicalNotes}
            onChange={(e) => setClinicalNotes(e.target.value)}
            placeholder="Observasi fisik, tanda vital, dan temuan pemeriksaan..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Rencana Terapi / Edukasi</label>
          <input
            type="text"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Contoh: Istirahat cukup, minum air putih 2L/hari"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Catatan Tindak Lanjut (Follow-up)</label>
          <input
            type="text"
            value={followUpNotes}
            onChange={(e) => setFollowUpNotes(e.target.value)}
            placeholder="Contoh: Kontrol ulang dalam 3 hari bila belum mereda"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Diagnosis ICD-10 */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          Diagnosis Medis (ICD-10)
        </h3>

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <label className="block font-semibold text-gray-700 mb-1">Kode ICD-10</label>
            <input
              type="text"
              value={diagnosisCode}
              onChange={(e) => setDiagnosisCode(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 uppercase font-mono font-bold text-center"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Nama Diagnosis</label>
            <input
              type="text"
              value={diagnosisName}
              onChange={(e) => setDiagnosisName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
            />
          </div>
        </div>
      </div>

      {/* Electronic Prescription Builder */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-purple-600" />
            Resep Obat Elektronik
          </h3>
          <button
            type="button"
            onClick={addPrescriptionItem}
            className="flex items-center gap-1 text-primary-600 font-semibold hover:bg-primary-50 px-2 py-1 rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Obat
          </button>
        </div>

        {prescriptionItems.map((item, idx) => (
          <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-700">Obat #{idx + 1}</span>
              {prescriptionItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePrescriptionItem(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nama Obat (e.g. Paracetamol)"
                value={item.medicineName}
                onChange={(e) => updateItem(idx, "medicineName", e.target.value)}
                className="col-span-2 bg-white border border-gray-200 rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Dosis (e.g. 500mg)"
                value={item.dosage}
                onChange={(e) => updateItem(idx, "dosage", e.target.value)}
                className="bg-white border border-gray-200 rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Frekuensi (e.g. 3x sehari)"
                value={item.frequency}
                onChange={(e) => updateItem(idx, "frequency", e.target.value)}
                className="bg-white border border-gray-200 rounded-lg p-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Floating Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
        <button
          onClick={() => completeMutation.mutate()}
          disabled={completeMutation.isPending}
          className="w-full bg-emerald-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-50 shadow-md shadow-emerald-600/20"
        >
          {completeMutation.isPending ? "Menyimpan Rekam Medis..." : "Selesaikan & Terbitkan Resep"}
        </button>
      </div>
    </div>
  );
}
