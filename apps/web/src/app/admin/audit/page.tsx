"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  ShieldAlert,
  Search,
  Filter,
  Eye,
  KeyRound,
  FileText,
  UserPlus,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";

interface AuditItem {
  id: string;
  action: string;
  resource: string;
  details: any;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role?: { name: string };
  };
}

export default function AdminAuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string>("ALL");

  useEffect(() => {
    fetchLogs();
  }, [selectedAction]);

  const fetchLogs = async () => {
    setLoading(true);
    const query = selectedAction !== "ALL" ? `?action=${selectedAction}` : "";
    const res = await apiClient(`/audit${query}`);
    if (res.success && res.data) {
      setLogs(res.data);
    } else {
      // Fallback mock audit events
      setLogs([
        {
          id: "log-1",
          action: "MEDICAL_RECORD_VIEWED",
          resource: "MedicalRecord",
          details: { recordId: "rec-882", patientId: "pat-1" },
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          user: { name: "dr. Andi Setiawan", email: "andi@kliniksehat.id", role: { name: "DOCTOR" } },
        },
        {
          id: "log-2",
          action: "LOGIN",
          resource: "Auth",
          details: { ip: "192.168.1.10" },
          createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          user: { name: "Budi Santoso", email: "budi@pasien.id", role: { name: "PATIENT" } },
        },
        {
          id: "log-3",
          action: "APPOINTMENT_CREATED",
          resource: "Appointment",
          details: { doctorId: "doc-1", appointmentTime: "10:00" },
          createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          user: { name: "Budi Santoso", email: "budi@pasien.id", role: { name: "PATIENT" } },
        },
        {
          id: "log-4",
          action: "PAYMENT_CREATED",
          resource: "Payment",
          details: { amount: 150000, method: "QRIS" },
          createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          user: { name: "Budi Santoso", email: "budi@pasien.id", role: { name: "PATIENT" } },
        },
        {
          id: "log-5",
          action: "USER_CREATED",
          resource: "User",
          details: { role: "PATIENT" },
          createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          user: { name: "Siti Rahma", email: "siti@pasien.id", role: { name: "PATIENT" } },
        },
      ]);
    }
    setLoading(false);
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "MEDICAL_RECORD_VIEWED":
        return <Eye className="w-4 h-4 text-purple-600" />;
      case "LOGIN":
        return <KeyRound className="w-4 h-4 text-emerald-600" />;
      case "USER_CREATED":
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case "PAYMENT_CREATED":
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-4 space-y-5 pb-28 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Audit Logs & Keamanan</h1>
          <p className="text-xs text-gray-500">Pencatatan aktivitas sistem dan riwayat akses</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: "Semua Aktivitas", value: "ALL" },
          { label: "Akses Rekam Medis", value: "MEDICAL_RECORD_VIEWED" },
          { label: "Otentikasi Login", value: "LOGIN" },
          { label: "Janji Temu", value: "APPOINTMENT_CREATED" },
          { label: "Pembayaran", value: "PAYMENT_CREATED" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedAction(tab.value)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition shadow-2xs ${
              selectedAction === tab.value
                ? "bg-primary-600 text-white"
                : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Log Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-4 rounded-3xl border border-gray-100 animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 p-6 space-y-2">
          <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-xs font-bold text-gray-700">Tidak ada log aktivitas</p>
          <p className="text-[11px] text-gray-500">Belum ada catatan aktivitas untuk filter ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => {
            const timeAgo = new Date(log.createdAt).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={log.id}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getActionIcon(log.action)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">{log.action}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{timeAgo} WIB</span>
                  </div>

                  <p className="text-[11px] text-gray-600">
                    Aktor: <span className="font-semibold text-gray-800">{log.user?.name || "System"}</span>{" "}
                    ({log.user?.role?.name || "USER"})
                  </p>

                  {log.details && (
                    <div className="bg-gray-50 p-2 rounded-xl text-[10px] font-mono text-gray-500 truncate">
                      {JSON.stringify(log.details)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
