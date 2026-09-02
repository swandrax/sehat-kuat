"use client";

import { X } from "lucide-react";
import Link from "next/link";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity" 
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 left-0 w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-4 flex items-center justify-between border-b">
          <h2 className="text-lg font-bold text-primary-600">KlinikSehat</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="p-4 flex flex-col gap-2">
          <DrawerLink href="/" label="Beranda" onClick={onClose} />
          <DrawerLink href="/doctors" label="Cari Dokter" onClick={onClose} />
          <DrawerLink href="/appointments" label="Janji Saya" onClick={onClose} />
          <DrawerLink href="/records" label="Rekam Medis" onClick={onClose} />
          <DrawerLink href="/labs" label="Hasil Lab" onClick={onClose} />
          <DrawerLink href="/chat" label="Chat" onClick={onClose} />
          <DrawerLink href="/tracker" label="Health Tracker" onClick={onClose} />
          <DrawerLink href="/articles" label="Artikel" onClick={onClose} />
          <div className="my-2 border-t" />
          <DrawerLink href="/settings" label="Pengaturan" onClick={onClose} />
          <DrawerLink href="/help" label="Bantuan" onClick={onClose} />
          <DrawerLink href="/logout" label="Keluar" onClick={onClose} className="text-red-600" />
        </nav>
      </div>
    </>
  );
}

function DrawerLink({ href, label, onClick, className = "text-gray-700" }: { href: string; label: string; onClick: () => void; className?: string }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`block px-4 py-3 rounded-lg hover:bg-gray-50 font-medium ${className}`}
    >
      {label}
    </Link>
  );
}
