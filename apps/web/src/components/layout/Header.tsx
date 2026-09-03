"use client";

import { useState } from "react";
import {
  Menu,
  Bell,
  Search,
  Activity,
  User,
  Stethoscope,
  Calendar,
  HeartPulse,
  Bot,
  BookOpen,
  ShoppingBag,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ZavoraLogo } from "@/components/common/ZavoraLogo";
import { useTheme } from "@/components/ThemeProvider";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/", icon: Activity },
    { name: "Fasilitas & Peta", href: "/facilities", icon: MapPin },
    { name: "Dokter", href: "/doctors", icon: Stethoscope },
    { name: "Janji Temu", href: "/appointments", icon: Calendar },
    { name: "Health Tracker", href: "/tracker", icon: HeartPulse },
    { name: "AI Assistant", href: "/ai-screening", icon: Bot },
    { name: "Edukasi", href: "/articles", icon: BookOpen },
    { name: "Marketplace", href: "/pharmacy", icon: ShoppingBag },
  ];

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center group">
              <ZavoraLogo size="md" theme={resolvedTheme === "dark" ? "light" : "colored"} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions: Theme Toggle / Role Portals / Notifications / Profile */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
              title={`Mode: ${theme} (Klik untuk ganti tema)`}
              aria-label="Ganti Tema"
            >
              {theme === "dark" ? (
                <Moon className="w-4 h-4 text-emerald-400" />
              ) : theme === "light" ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              )}
            </button>

            {/* Quick Doctor / Admin Portals on Desktop */}
            <div className="hidden md:flex items-center gap-1.5 mr-1">
              <Link
                href="/doctor"
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition border border-slate-200 dark:border-slate-700"
              >
                Portal Dokter
              </Link>
              <Link
                href="/admin"
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
              >
                Admin
              </Link>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative"
                aria-label="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>

              {notificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Notifikasi Kesehatan</h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">Tandai Dibaca</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100/60 dark:border-emerald-800/40">
                      <p className="font-bold text-emerald-950 dark:text-emerald-300">Jadwal Konsultasi Dokter</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Konsultasi Anda dengan dr. Andi dijadwalkan besok pukul 10:00 WIB.</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">10 menit lalu</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Tanda Vital Terbarui</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Tekanan darah Anda 120/80 mmHg (Normal).</p>
                      <span className="text-[9px] text-slate-400 mt-1 block">Hari ini, 08:30</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Login */}
            <Link
              href="/profile/patient"
              className="flex items-center gap-2 p-1 pl-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full transition"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">
                {user?.name || "Pasien"}
              </span>
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                {user?.name?.charAt(0) || "Z"}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
