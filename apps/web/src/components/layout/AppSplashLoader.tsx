"use client";

import { useEffect, useState } from "react";
import { Stethoscope, HeartPulse, Sparkles, ShieldCheck } from "lucide-react";

export function AppSplashLoader() {
  const [visible, setVisible] = useState(true);
  const [fadeState, setFadeState] = useState<"showing" | "fading" | "hidden">("showing");

  useEffect(() => {
    // Show splash screen for 1.2s on initial app load, then smoothly fade out
    const timer = setTimeout(() => {
      setFadeState("fading");
      const removeTimer = setTimeout(() => {
        setFadeState("hidden");
        setVisible(false);
      }, 500); // fade duration
      return () => clearTimeout(removeTimer);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible || fadeState === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-500 bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-800 text-white flex flex-col items-center justify-between p-8 transition-opacity duration-500 max-w-md mx-auto select-none ${
        fadeState === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Branding Tag */}
      <div className="pt-8 flex items-center gap-1.5 text-xs font-semibold text-primary-200 tracking-wider uppercase">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Klinik Layanan Digital Terpercaya</span>
      </div>

      {/* Center Animated Logo & Branding */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          {/* Glowing Pulse Rings */}
          <div className="absolute inset-0 rounded-3xl bg-white/20 animate-ping duration-1000"></div>
          <div className="absolute -inset-2 rounded-3xl bg-emerald-400/20 blur-md animate-pulse"></div>

          {/* Core Logo Box */}
          <div className="relative w-24 h-24 rounded-3xl bg-white text-primary-600 shadow-2xl flex items-center justify-center transform transition-transform hover:scale-105">
            <HeartPulse className="w-12 h-12 text-rose-500 animate-pulse" />
            <Stethoscope className="w-7 h-7 text-primary-700 absolute right-3 bottom-3" />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-white">
            KLINIKSEHAT
          </h1>
          <p className="text-xs text-primary-100 font-medium mt-1">
            Sehat, Kuat, & Terhubung Setiap Saat
          </p>
        </div>

        {/* Loading Indicator Spinner & Text */}
        <div className="flex flex-col items-center gap-2 pt-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></span>
            <span
              className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></span>
          </div>
          <p className="text-[11px] text-primary-200 font-medium">
            Menyiapkan layanan kesehatan digital...
          </p>
        </div>
      </div>

      {/* Bottom Version */}
      <div className="pb-4 text-center">
        <p className="text-[10px] text-primary-300">v1.0.0 • AI-Powered Telemedicine</p>
      </div>
    </div>
  );
}
