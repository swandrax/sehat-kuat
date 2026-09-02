"use client";

import { useQuery } from "@tanstack/react-query";
import { User, MapPin, Activity, Calendar, Droplet, Phone } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["patientProfile"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/profile`, {
        // In real app, credentials are sent via HttpOnly cookie automatically
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: isAuthenticated && user?.role === "PATIENT",
  });

  if (isLoading) return <div className="p-6 text-center">Loading profile...</div>;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">Profil Pasien</h2>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Information Cards */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700 text-sm">Informasi Medis Dasar</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <ProfileRow icon={<Droplet className="w-4 h-4 text-red-500" />} label="Golongan Darah" value={profile?.bloodType || "Belum diatur"} />
          <ProfileRow icon={<Calendar className="w-4 h-4 text-blue-500" />} label="Tanggal Lahir" value={profile?.dateOfBirth || "Belum diatur"} />
          <ProfileRow icon={<Activity className="w-4 h-4 text-green-500" />} label="Jenis Kelamin" value={profile?.gender || "Belum diatur"} />
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700 text-sm">Kontak & Lokasi</h3>
        </div>
        <div className="divide-y divide-gray-50">
          <ProfileRow icon={<Phone className="w-4 h-4 text-gray-400" />} label="Nomor Telepon" value={profile?.phone || "Belum diatur"} />
          <ProfileRow icon={<MapPin className="w-4 h-4 text-gray-400" />} label="Alamat" value={profile?.address || "Belum diatur"} />
        </div>
      </section>

      <button className="w-full bg-primary-50 text-primary-600 font-semibold py-3 rounded-xl hover:bg-primary-100 transition-colors">
        Edit Profil
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
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}
