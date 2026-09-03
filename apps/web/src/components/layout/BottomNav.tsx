"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Calendar, BookOpen, Umbrella, ShoppingBag } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Chat", href: "/chat", icon: MessageSquare },
    { label: "Buat Janji", href: "/doctors", icon: Calendar },
    { label: "Artikel", href: "/articles", icon: BookOpen },
    { label: "Langganan", href: "/subscription", icon: Umbrella },
    { label: "Beli Obat", href: "/pharmacy", icon: ShoppingBag },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 z-50 py-1.5 px-2 shadow-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/doctors" && (pathname.startsWith("/doctors") || pathname.startsWith("/appointments")));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 transition-colors ${
                isActive ? "text-primary-600 font-bold" : "text-gray-500 hover:text-gray-800 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-primary-600" : "text-gray-500"}`} />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
