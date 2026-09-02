import { Search, Stethoscope, Calendar, MessageCircle, FileText, Activity, Pill, HeartPulse, BookOpen, Bot } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="p-4 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cari dokter, spesialis, atau info..." 
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        />
      </div>

      {/* Primary Services */}
      <section>
        <div className="grid grid-cols-4 gap-4">
          <ServiceIcon icon={<Stethoscope />} label="Cari Dokter" href="/doctors" color="bg-blue-100 text-blue-600" />
          <ServiceIcon icon={<Calendar />} label="Buat Janji" href="/appointments/new" color="bg-teal-100 text-teal-600" />
          <ServiceIcon icon={<MessageCircle />} label="Chat Dokter" href="/chat" color="bg-purple-100 text-purple-600" />
          <ServiceIcon icon={<FileText />} label="Rekam Medis" href="/records" color="bg-orange-100 text-orange-600" />
        </div>
      </section>

      {/* Secondary Services */}
      <section>
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Layanan Lainnya</h3>
        <div className="grid grid-cols-4 gap-4">
          <ServiceIcon icon={<Activity />} label="Hasil Lab" href="/labs" color="bg-red-100 text-red-600" />
          <ServiceIcon icon={<Pill />} label="Beli Obat" href="/pharmacy" color="bg-green-100 text-green-600" />
          <ServiceIcon icon={<HeartPulse />} label="Tracker" href="/tracker" color="bg-rose-100 text-rose-600" />
          <ServiceIcon icon={<BookOpen />} label="Artikel" href="/articles" color="bg-yellow-100 text-yellow-600" />
        </div>
      </section>

      {/* AI Assistant */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5" />
            <h3 className="font-bold">KlinikSehat AI</h3>
          </div>
          <p className="text-xs text-primary-50 mb-4">Asisten kesehatan pintar untuk membantu Anda.</p>
          <div className="flex flex-wrap gap-2">
            <AIPill label="Pahami Keluhan" />
            <AIPill label="Pahami Hasil Lab" />
            <AIPill label="Tanya Obat" />
          </div>
        </div>
        <Bot className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
      </section>

      {/* Health Education (Articles) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 text-sm">Artikel Kesehatan</h3>
          <Link href="/articles" className="text-xs text-primary-600 font-medium">Lihat Semua</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          <ArticleCard title="Tips Menjaga Kesehatan Jantung" category="Pencegahan" />
          <ArticleCard title="Mengenal Gejala Awal Diabetes" category="Penyakit" />
        </div>
      </section>
    </div>
  );
}

function ServiceIcon({ icon, label, href, color }: { icon: React.ReactNode, label: string, href: string, color: string }) {
  return (
    <Link href={href} className="flex flex-col items-center gap-2 text-center group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-sm group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <span className="text-[11px] font-medium text-gray-600 leading-tight">{label}</span>
    </Link>
  );
}

function AIPill({ label }: { label: string }) {
  return (
    <button className="bg-white/20 hover:bg-white/30 transition-colors text-white text-[11px] px-3 py-1.5 rounded-full backdrop-blur-sm">
      {label}
    </button>
  );
}

function ArticleCard({ title, category }: { title: string, category: string }) {
  return (
    <div className="min-w-[200px] snap-start bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
      <div className="w-full h-24 bg-gray-100 rounded-xl mb-3"></div>
      <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">{category}</span>
      <h4 className="text-sm font-semibold text-gray-800 leading-tight mt-1">{title}</h4>
    </div>
  );
}
