"use client";

import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
  userName?: string;
}

export function Header({ onMenuClick, userName = "Pasien" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-primary-600 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="p-1 -ml-1 rounded-full hover:bg-primary-700 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-sm font-semibold">KlinikSehat</h1>
            <p className="text-xs text-primary-100">Halo, {userName}</p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-primary-700 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-primary-600"></span>
        </button>
      </div>
    </header>
  );
}
