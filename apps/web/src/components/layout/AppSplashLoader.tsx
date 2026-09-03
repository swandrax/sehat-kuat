"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Activity, ShieldCheck } from "lucide-react";

export function AppSplashLoader() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("zavora_splash_shown");
  });
  const [fadeState, setFadeState] = useState<"showing" | "fading" | "hidden">("showing");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (sessionStorage.getItem("zavora_splash_shown")) {
      return;
    }

    // Fast, lightweight splash animation for smooth LCP and user experience
    const timer = setTimeout(() => {
      setFadeState("fading");
      sessionStorage.setItem("zavora_splash_shown", "true");
      const removeTimer = setTimeout(() => {
        setFadeState("hidden");
        setVisible(false);
      }, 300);
      return () => clearTimeout(removeTimer);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (!visible || fadeState === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-500 bg-slate-950 text-white flex flex-col items-center justify-between p-8 transition-opacity duration-300 select-none ${
        fadeState === "fading" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Top Branding Tag */}
      <div className="pt-6 flex items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider bg-emerald-950/70 px-4 py-1.5 rounded-full border border-emerald-800/60 shadow-xs">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Healthcare & Better Living</span>
      </div>

      {/* Center Animated Logo & Branding */}
      <div className="flex flex-col items-center text-center space-y-5 max-w-xs">
        <div className="relative">
          {/* Glowing Pulse Rings */}
          <div className="absolute -inset-4 rounded-3xl bg-emerald-500/20 blur-xl animate-pulse"></div>

          {/* Core Emblem with Logo Image */}
          <div className="relative w-28 h-28 rounded-3xl bg-white shadow-2xl flex items-center justify-center border border-emerald-400/30 overflow-hidden p-2 transform transition-transform hover:scale-105">
            {!imageError ? (
              <Image
                src="/logo-zavora.png"
                alt="Logo Zavora Life"
                width={96}
                height={96}
                priority
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <Activity className="w-14 h-14 text-emerald-600 animate-pulse" />
            )}
          </div>
        </div>

        {/* Text Zavora in Crisp White */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
              Zavora
            </span>
            <span className="text-3xl font-medium tracking-tight text-emerald-400 drop-shadow-sm">
              Life
            </span>
          </div>
          <p className="text-xs text-slate-300 font-medium tracking-tight">
            All-in-One Health. Better Living.
          </p>
        </div>

        {/* Loading Spinner & Status */}
        <div className="flex flex-col items-center gap-2 pt-2">
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
          <p className="text-[11px] text-slate-400 font-medium">
            Memuat layanan kesehatan Zavora Life...
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="pb-4 text-center">
        <p className="text-[10px] text-slate-500 font-mono">
          Zavora Life Platform • v1.0.0
        </p>
      </div>
    </div>
  );
}
