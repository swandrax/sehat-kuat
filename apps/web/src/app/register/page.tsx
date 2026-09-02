"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";

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
        router.push("/");
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
    <div className="p-6 h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold text-primary-600 mb-2">Daftar</h1>
      <p className="text-gray-500 mb-6 text-sm">Mulai perjalanan sehatmu bersama KlinikSehat</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500"
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Daftar Sebagai</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="PATIENT">Pasien</option>
            <option value="DOCTOR">Dokter</option>
          </select>
        </div>
        <button 
          disabled={loading}
          type="submit" 
          className="w-full bg-primary-600 text-white p-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-600">
        Sudah punya akun? <Link href="/login" className="text-primary-600 font-semibold">Masuk</Link>
      </p>
    </div>
  );
}
