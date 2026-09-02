"use client";

import { useState } from "react";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setIsDrawerOpen(true)} />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <main className="min-h-screen bg-gray-50 pb-20">
        {children}
      </main>
    </>
  );
}
