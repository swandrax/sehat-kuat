"use client";

import {
  X,
  Activity,
  Stethoscope,
  Calendar,
  HeartPulse,
  Bot,
  BookOpen,
  ShoppingBag,
  User,
  ShieldCheck,
  Lock,
  LogOut,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ZavoraLogo } from "@/components/common/ZavoraLogo";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  if (!isOpen) return null;

  const baseLinks = [
    { name: "Dashboard", href: "/", icon: Activity },
    { name: "Fasilitas & Peta", href: "/facilities", icon: MapPin },
    { name: "Cari Dokter", href: "/doctors", icon: Stethoscope },
    { name: "Janji Temu Saya", href: "/appointments", icon: Calendar },
    { name: "Health Tracker & Vital", href: "/tracker", icon: HeartPulse },
    { name: "AI Health Assistant", href: "/ai-screening", icon: Bot },
    { name: "Artikel & Edukasi", href: "/articles", icon: BookOpen },
    { name: "Apotek & Marketplace", href: "/pharmacy", icon: ShoppingBag },
  ];

  const links = [
    ...baseLinks,
    ...(user?.role === "DOCTOR" ? [{ name: "Portal Dokter", href: "/doctor", icon: Stethoscope }] : []),
    ...(user?.role === "ADMIN" ? [{ name: "Admin Control Center", href: "/admin", icon: Lock }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-start">
      <div className="w-80 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <ZavoraLogo size="sm" />
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Preview */}
          <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {user?.name?.charAt(0) || "Z"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Pasien"}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || "pasien@zavoralife.id"}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[50vh]">
            {links.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          <p className="text-[10px] text-slate-400 mb-2">Zavora Life — Better Living</p>
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold transition text-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> Keluar Akun
          </button>
        </div>
      </div>
    </div>
  );
}
