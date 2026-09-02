"use client";

import { useQuery } from "@tanstack/react-query";
import { User, MapPin, Activity, Calendar, Droplet, Phone, LogOut, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, [isAuthenticated, router]);

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ["patientProfile"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/profile`, {
        // In a real app with cookies, we'd add credentials: 'include'
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    enabled: isAuthenticated && user?.role === "PATIENT",
  });

  const profile = profileResponse?.data;

  if (isLoading) return <div className="p-6 text-center text-primary-600 animate-pulse">Memuat data profil...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 flex items-center shadow-md rounded-b-3xl">
        <button onClick={() => router.back()} className="p-2 hover:bg-primary-500 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-4 flex-1">
          <h1 className="text-xl font-bold">KlinikSehat</h1>
          <p className="text-xs text-primary-100">Profil Pasien</p>
        </div>
        <ShieldCheck className="w-6 h-6 text-primary-200" />
      </div>

      <div className="p-4 space-y-6 mt-4">
        {/* Profile Card */}
        <div className="flex items-center gap-4 bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center text-white shadow-inner">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{profile?.user?.email || user?.email}</h2>
            <div className="inline-block mt-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Pasien Terverifikasi
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm">Informasi Medis Dasar</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <ProfileRow icon={<Droplet className="w-5 h-5 text-red-500" />} label="Golongan Darah" value={profile?.bloodType || "Belum diatur"} />
            <ProfileRow icon={<Calendar className="w-5 h-5 text-blue-500" />} label="Tanggal Lahir" value={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('id-ID') : "Belum diatur"} />
            <ProfileRow icon={<Activity className="w-5 h-5 text-green-500" />} label="Jenis Kelamin" value={profile?.gender || "Belum diatur"} />
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
            <h3 className="font-semibold text-gray-700 text-sm">Kontak & Lokasi</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <ProfileRow icon={<Phone className="w-5 h-5 text-gray-400" />} label="Nomor Telepon" value={profile?.phone || "Belum diatur"} />
            <ProfileRow icon={<MapPin className="w-5 h-5 text-gray-400" />} label="Alamat" value={profile?.address || "Belum diatur"} />
          </div>
        </section>

        <div className="flex flex-col gap-3 pt-2">
          <button className="w-full bg-primary-50 text-primary-600 font-semibold py-3.5 rounded-xl hover:bg-primary-100 transition-colors shadow-sm">
            Edit Profil
          </button>
          
          <button 
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-3.5 rounded-xl hover:bg-red-100 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <span className="text-sm text-gray-600 font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-800">{value}</span>
    </div>
  );
}
