"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { canUseZavoraLifeChatbot } from "@/lib/chatbot-guard";
import { Header } from "./Header";
import { MobileDrawer } from "./MobileDrawer";
import { BottomNav } from "./BottomNav";
import { AppSplashLoader } from "./AppSplashLoader";

// Lazy-load FloatingChatbot only when authorized to optimize LCP and bundle size
const FloatingChatbot = dynamic(
  () => import("@/components/chatbot/FloatingChatbot").then((mod) => mod.FloatingChatbot),
  { ssr: false }
);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();

  // Enforce strict chatbot visibility rules:
  // Guest on homepage / landing -> TRUE
  // Authenticated Patient -> TRUE
  // Doctors, Admins, Internal roles -> FALSE (Hidden & not loaded)
  const isChatbotAllowed = canUseZavoraLifeChatbot(user, pathname);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      <AppSplashLoader />
      <Header onMenuClick={() => setIsDrawerOpen(true)} />
      <MobileDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {children}
      </main>
      <BottomNav />

      {/* Floating Zavora Life AI Assistant with Like/Unlike Feedback */}
      {isChatbotAllowed && <FloatingChatbot />}
    </div>
  );
}
