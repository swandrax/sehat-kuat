"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, ShieldCheck, UserPlus, Users } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PATIENT");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleLocationSync = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/location`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          });
        } catch (e) {
          console.error("Failed to sync location", e);
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        login(data.data);
        await handleLocationSync(); // Ask for location after successful register
        
        if (data.data.role === 'DOCTOR') {
          router.push('/profile/doctor');
        } else {
          router.push("/");
        }
      } else {
        alert(data.message || "Registration failed");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 flex items-center shadow-md rounded-b-3xl shrink-0">
        <button onClick={() => router.back()} className="p-2 hover:bg-primary-500 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-4 flex-1">
          <h1 className="text-xl font-bold">KlinikSehat</h1>
          <p className="text-xs text-primary-100">Buat Akun Baru</p>
        </div>
        <ShieldCheck className="w-6 h-6 text-primary-200" />
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6 shadow-inner mx-auto">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Daftar Sekarang</h2>
          <p className="text-gray-500 text-sm text-center mb-8">Mulai perjalanan sehatmu bersama KlinikSehat hari ini.</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                required 
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="password" 
                placeholder="Buat Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                required 
              />
            </div>

            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all appearance-none"
              >
                <option value="PATIENT">👨‍⚕️ Pasien</option>
                <option value="DOCTOR">🩺 Dokter</option>
              </select>
            </div>

            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-3.5 rounded-xl font-semibold shadow-md shadow-primary-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                "Daftar Akun"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-600 pb-6">
          Sudah punya akun? <Link href="/login" className="text-primary-600 font-bold hover:underline">Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
}
