"use client";

import { useQuery } from "@tanstack/react-query";
import { User, MapPin, Award, BookOpen, Clock, Phone } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DoctorProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["doctorProfile"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/profile`, {
        // In real app, credentials are sent via HttpOnly cookie automatically
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: isAuthenticated && user?.role === "DOCTOR",
  });

  if (isLoading) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-primary-600 p-4 rounded-2xl shadow-sm text-white">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold">Profil Dokter</h2>
          <p className="text-sm text-primary-100">{user?.email}</p>
          <div className="mt-1 inline-flex items-center bg-white/20 px-2 py-0.5 rounded text-xs font-medium">
            Verified Practitioner
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700 text-sm">Informasi Profesional</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <ProfileRow icon={<Award className="w-4 h-4 text-yellow-500" />} label="Spesialisasi" value={profile?.specialization?.name || "Dokter Umum"} />
          <ProfileRow icon={<Clock className="w-4 h-4 text-blue-500" />} label="Pengalaman" value={profile?.experienceYears ? `${profile.experienceYears} Tahun` : "Belum diatur"} />
          <ProfileRow icon={<BookOpen className="w-4 h-4 text-green-500" />} label="Pendidikan" value={profile?.education || "Belum diatur"} />
        </div>
      </section>

      {/* Contact & Clinic */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700 text-sm">Kontak & Praktik</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <ProfileRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="Nomor Telepon" value={profile?.phone || "Belum diatur"} />
          <ProfileRow icon={<MapPin className="w-4 h-4 text-gray-400" />} label="Lokasi Praktik" value={profile?.address || "Belum diatur"} />
        </div>
      </section>

      <button className="w-full bg-primary-50 text-primary-600 font-semibold py-3 rounded-xl hover:bg-primary-100 transition-colors">
        Edit Profil Profesional
      </button>
    </div>
  );
}

function ProfileRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-800 text-right max-w-[50%] truncate">{value}</span>
    </div>
  );
}
