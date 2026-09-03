"use client";

import React from "react";
import {
  X,
  MapPin,
  Clock,
  Phone,
  Star,
  Navigation,
  Calendar,
  ShieldCheck,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { HealthcareFacility } from "@/stores/facilitiesStore";
import Link from "next/link";

interface FacilityDetailsModalProps {
  facility: HealthcareFacility | null;
  onClose: () => void;
}

export function FacilityDetailsModal({
  facility,
  onClose,
}: FacilityDetailsModalProps) {
  if (!facility) return null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                {facility.type}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  facility.isOpenNow
                    ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {facility.operatingHours}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {facility.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{facility.address}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-750">
              <p className="text-[10px] font-medium text-slate-400">Jarak Dari Anda</p>
              <p className="text-sm font-black text-slate-900 dark:text-white mt-0.5">
                {facility.distanceKm ?? 2.4} km
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-750">
              <p className="text-[10px] font-medium text-slate-400">Waktu Tempuh</p>
              <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
                ~{facility.estimatedMinutes ?? 9} menit
              </p>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-750">
              <p className="text-[10px] font-medium text-slate-400">Rating Pasien</p>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {facility.rating}
                </span>
                <span className="text-[10px] text-slate-400">({facility.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-750 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Telepon Faskes:
              </span>
              <a
                href={`tel:${facility.phone}`}
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                {facility.phone}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Jam Operasional:
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {facility.operatingHours}
              </span>
            </div>
          </div>

          {/* Available Services */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Layanan & Fasilitas Tersedia
            </h4>
            <div className="flex flex-wrap gap-2">
              {facility.services.map((srv) => (
                <span
                  key={srv}
                  className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{srv}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-2"
          >
            <Navigation className="w-4 h-4 text-blue-600" />
            Buka Navigasi Rute
          </a>
          <Link
            href="/appointments/new"
            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold text-center transition shadow-xs flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Buat Janji Temu
          </Link>
        </div>
      </div>
    </div>
  );
}
