"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { doctorsApi } from "@/lib/api";
import { Search, MapPin, Award, Calendar, Star, ChevronRight, Stethoscope } from "lucide-react";
import Link from "next/link";

const SPECIALIZATIONS = [
  "Semua",
  "Spesialis Penyakit Dalam",
  "Spesialis Anak",
  "Dokter Umum",
  "Spesialis Jantung",
  "Spesialis Mata",
];

export default function DoctorDiscoveryPage() {
  const [search, setSearch] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("Semua");

  const { data: response, isLoading } = useQuery({
    queryKey: ["doctors", search, selectedSpec],
    queryFn: async () => {
      const specFilter = selectedSpec !== "Semua" ? selectedSpec : undefined;
      const res = await doctorsApi.getAll({
        search: search || specFilter,
      });
      return res.data || [];
    },
  });

  const doctors = Array.isArray(response) ? response : [];

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Cari Dokter</h1>
        <p className="text-xs text-gray-500 mt-0.5">Temukan dokter spesialis terbaik di KlinikSehat</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama dokter atau spesialisasi..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all shadow-inner"
        />
      </div>

      {/* Specialization Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {SPECIALIZATIONS.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpec(spec)}
            className={`px-3.5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedSpec === spec
                ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Doctors List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
            Memuat daftar dokter...
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Stethoscope className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">Dokter tidak ditemukan</p>
            <p className="text-xs text-gray-400 mt-1">Coba kata kunci atau spesialisasi lain</p>
          </div>
        ) : (
          doctors.map((doc: any) => (
            <Link
              key={doc.id}
              href={`/doctors/${doc.id}`}
              className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-primary-100 active:scale-[0.99]"
            >
              <div className="flex gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-inner shrink-0">
                  {doc.user?.name?.charAt(0) || "D"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{doc.user?.name}</h3>
                    <div className="flex items-center text-[10px] text-amber-500 font-semibold bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" /> 4.9
                    </div>
                  </div>

                  <p className="text-xs text-primary-600 font-medium mt-0.5">{doc.specialization}</p>

                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      <span>{doc.experienceYears || 5}+ thn</span>
                    </div>
                    {doc.clinic && (
                      <div className="flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{doc.clinic.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Schedule Preview Bar */}
              <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{doc.schedules?.length || 0} Jadwal Praktik Tersedia</span>
                </div>
                <div className="text-primary-600 font-semibold flex items-center gap-0.5">
                  Buat Janji <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
