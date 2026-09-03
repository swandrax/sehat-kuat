"use client";

import { Activity, Stethoscope, Calendar, HeartPulse, Bot, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Activity },
    { label: "Dokter", href: "/doctors", icon: Stethoscope },
    { label: "Janji Temu", href: "/appointments", icon: Calendar },
    { label: "Tracker", href: "/tracker", icon: HeartPulse },
    { label: "AI Health", href: "/ai-screening", icon: Bot },
    { label: "Profil", href: "/profile/patient", icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] px-2 py-2 transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium"
              }`}
            >
              <div
                className={`p-1 rounded-lg transition ${
                  isActive ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
