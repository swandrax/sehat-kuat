"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Activity } from "lucide-react";

interface ZavoraLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  theme?: "dark" | "light" | "colored";
  whiteText?: boolean;
}

export function ZavoraLogo({
  size = "md",
  showTagline = true,
  theme = "colored",
  whiteText = false,
}: ZavoraLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeMap = {
    sm: {
      box: "w-7 h-7 rounded-lg",
      icon: "w-4 h-4",
      title: "text-sm",
      tagline: "text-[8px]",
    },
    md: {
      box: "w-9 h-9 rounded-xl",
      icon: "w-5 h-5",
      title: "text-base",
      tagline: "text-[9px]",
    },
    lg: {
      box: "w-12 h-12 rounded-2xl",
      icon: "w-6 h-6",
      title: "text-xl",
      tagline: "text-[10px]",
    },
    xl: {
      box: "w-16 h-16 rounded-3xl",
      icon: "w-8 h-8",
      title: "text-2xl",
      tagline: "text-xs",
    },
  };

  const currentSize = sizeMap[size];

  // If whiteText or theme is light/dark, text 'Zavora' is rendered in crisp pure white
  const titleColor =
    whiteText || theme === "light"
      ? "text-white"
      : "text-slate-900";

  const brandAccentColor =
    whiteText || theme === "light"
      ? "text-emerald-400"
      : "text-emerald-600";

  const taglineColor =
    whiteText || theme === "light"
      ? "text-slate-300"
      : "text-slate-500";

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Official Z Logo Emblem */}
      <div
        className={`${currentSize.box} bg-white flex items-center justify-center shadow-xs shrink-0 border border-slate-100 overflow-hidden relative p-0.5 rounded-2xl`}
      >
        {!imageError ? (
          <Image
            src="/logo-zavora.png"
            alt="Zavora Life"
            width={48}
            height={48}
            priority
            className="w-full h-full object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center rounded-xl">
            <Activity className={`${currentSize.icon} text-white`} />
          </div>
        )}
      </div>

      {/* Brand Typography */}
      <div>
        <div className="flex items-center gap-1 leading-none">
          <span className={`${currentSize.title} font-extrabold tracking-tight ${titleColor}`}>
            Zavora
          </span>
          <span className={`${currentSize.title} font-medium tracking-tight ${brandAccentColor}`}>
            Life
          </span>
        </div>
        {showTagline && (
          <p className={`${currentSize.tagline} font-medium ${taglineColor} tracking-tight mt-0.5`}>
            All-in-One Health. Better Living.
          </p>
        )}
      </div>
    </div>
  );
}
