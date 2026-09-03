"use client";

import { ArrowLeft, Search, BookOpen, Clock, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

import { BottomNav } from "@/components/layout/BottomNav";

export default function ArticlesPage() {
  const router = useRouter();

  const categories = ["Semua", "Pencegahan", "Penyakit", "Gizi", "Kebugaran", "Mental"];
  
  const articles = [
    {
      id: 1,
      title: "10 Tips Menjaga Kesehatan Jantung di Usia Muda",
      category: "Pencegahan",
      readTime: "5 min",
      image: "bg-red-100",
      date: "02 Sep 2024"
    },
    {
      id: 2,
      title: "Mengenal Gejala Awal Diabetes yang Sering Diabaikan",
      category: "Penyakit",
      readTime: "8 min",
      image: "bg-blue-100",
      date: "31 Ags 2024"
    },
    {
      id: 3,
      title: "Pentingnya Menjaga Pola Makan untuk Imunitas",
      category: "Gizi",
      readTime: "4 min",
      image: "bg-green-100",
      date: "28 Ags 2024"
    }
  ];

  return (
    <div className="p-4 space-y-6 pb-24 bg-gray-50 min-h-screen max-w-md mx-auto relative">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Artikel Kesehatan</h1>
          <p className="text-xs text-gray-500">Info & tips terpercaya</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Cari topik artikel..." 
          className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat, idx) => (
          <button
            key={cat}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              idx === 0 
                ? "bg-primary-600 text-white shadow-sm" 
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group cursor-pointer hover:border-primary-200 transition-colors">
            <div className={`h-36 sm:h-auto sm:w-32 ${article.image} flex items-center justify-center`}>
              <BookOpen className="w-8 h-8 text-white/50" />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {article.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-primary-700 transition-colors">
                  {article.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 mt-4 text-[10px] text-gray-400 font-semibold">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {article.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {article.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
