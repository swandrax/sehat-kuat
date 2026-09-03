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

export const metadata = {
  metadataBase: new URL("https://zavora-life.laravel.cloud"),
  title: "Zavora Life — All-in-One Health, Better Living",
  description: "Platform Layanan Kesehatan Digital, Konsultasi Dokter Spesialis, Monitoring Tanda Vital, & AI Assistant Terpercaya",
  keywords: ["Zavora Life", "Telemedisin", "Konsultasi Dokter", "Rekam Medis", "Health Tracker", "AI Screening", "Klinik Digital"],
  authors: [{ name: "Zavora Life Medical Platform" }],
  creator: "Zavora Life",
  publisher: "Zavora Life Healthcare",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Zavora Life",
  },
  openGraph: {
    title: "Zavora Life — All-in-One Health, Better Living",
    description: "Platform Layanan Kesehatan Digital, Konsultasi Dokter Spesialis, & AI Assistant Terpercaya",
    url: "https://zavora-life.laravel.cloud",
    siteName: "Zavora Life",
    images: [
      {
        url: "/logo-zavora.png",
        width: 800,
        height: 600,
        alt: "Zavora Life Healthcare",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zavora Life — All-in-One Health, Better Living",
    description: "Platform Layanan Kesehatan Digital & Konsultasi Dokter Spesialis",
    images: ["/logo-zavora.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
};

import { AppLayout } from "@/components/layout/AppLayout";
import { Providers } from "@/components/Providers";
import { PwaRegister } from "@/components/pwa/PwaRegister";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: "Zavora Life",
    url: "https://zavora-life.laravel.cloud",
    logo: "https://zavora-life.laravel.cloud/logo-zavora.png",
    description: "All-in-One Health, Better Living. Digital Healthcare, Telemedicine, and AI Screening Platform.",
    medicalSpecialty: ["InternalMedicine", "Pediatrics", "Cardiovascular", "GeneralPractice"],
  };

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Zavora Life" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
        <Providers>
          <PwaRegister />
          <PwaInstallPrompt />
          <div className="w-full min-h-screen bg-slate-50 dark:bg-[#090d16] relative flex flex-col">
            <AppLayout>
              {children}
            </AppLayout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
