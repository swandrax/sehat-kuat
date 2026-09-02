import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KlinikSehat | Layanan Kesehatan Digital",
  description: "Platform Layanan Kesehatan Digital",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { AppLayout } from "@/components/layout/AppLayout";
import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative">
            <AppLayout>
              {children}
            </AppLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
