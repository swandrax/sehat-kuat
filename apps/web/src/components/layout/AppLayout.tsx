"use client";

import { useState } from "react";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";
import { BottomNav } from "./BottomNav";
import { AppSplashLoader } from "./AppSplashLoader";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <AppSplashLoader />
      <Header onMenuClick={() => setIsDrawerOpen(true)} />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
