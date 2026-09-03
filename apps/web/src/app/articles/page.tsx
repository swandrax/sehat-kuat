"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Clock,
  Calendar,
  Bookmark,
  Share2,
  User,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  author: string;
  authorRole: string;
  readTime: string;
  date: string;
  tagColor: string;
}

const ARTICLES_DATA: Article[] = [
  {
    id: 1,
    title: "10 Tips Menjaga Kesehatan Jantung di Usia Produktif",
    description:
      "Panduan praktis menjaga ritme kardiovaskular, pola olahraga aerobik teratur, dan pengaturan asupan sodium harian.",
    category: "Pencegahan",
    author: "dr. Budi Setiawan, Sp.JP",
    authorRole: "Spesialis Jantung & Pembuluh Darah",
    readTime: "5 min baca",
    date: "02 Sep 2024",
    tagColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  {
    id: 2,
    title: "Mengenal Gejala Awal Diabetes yang Sering Diabaikan",
    description:
      "Kenali tanda trias diabetes (poliuria, polidipsia, polifagia) dan kapan Anda harus melakukan tes HbA1c secara berkala.",
    category: "Penyakit Dalam",
    author: "dr. Andi Setiawan, Sp.PD",
    authorRole: "Spesialis Penyakit Dalam",
    readTime: "8 min baca",
    date: "31 Ags 2024",
    tagColor: "bg-blue-50 text-blue-800 border-blue-200",
  },
  {
    id: 3,
    title: "Pola Makan Tepat & Nutrisi untuk Meningkatkan Imunitas Alami",
    description:
      "Peran mikronutrien vitamin C, vitamin D3, zinc, dan probiotik usus dalam menangkal infeksi patogen musiman.",
    category: "Gizi & Nutrisi",
    author: "dr. Amanda Kartika, Sp.A",
    authorRole: "Spesialis Anak & Nutrisi Keluarga",
    readTime: "4 min baca",
    date: "28 Ags 2024",
    tagColor: "bg-teal-50 text-teal-800 border-teal-200",
  },
  {
    id: 4,
    title: "Manajemen Stres dan Pengaruh Kualitas Tidur terhadap Tekanan Darah",
    description:
      "Bagaimana ritme sirkadian yang stabil dan teknik pernapasan mindfulness membantu regulasi sistem saraf simpatis.",
    category: "Kesehatan Mental",
    author: "dr. Rina Wijaya",
    authorRole: "Dokter Umum Zavora Life",
    readTime: "6 min baca",
    date: "25 Ags 2024",
    tagColor: "bg-purple-50 text-purple-800 border-purple-200",
  },
];

export default function ArticlesEducationPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);

  const categories = [
    "Semua",
    "Pencegahan",
    "Penyakit Dalam",
    "Gizi & Nutrisi",
    "Kesehatan Mental",
    "Anak",
  ];

  const handleBookmarkToggle = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bId) => bId !== id));
      toast.info("Artikel dihapus dari bookmark");
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
      toast.success("Artikel disimpan ke bookmark Anda!");
    }
  };

  const filteredArticles = ARTICLES_DATA.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.description.toLowerCase().includes(search.toLowerCase()) ||
      art.author.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "Semua" || art.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Pusat Edukasi & Artikel Medis Terverifikasi</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Artikel & Wawasan Sehat
          </h1>
          <p className="text-xs text-slate-500">
            Ditulis dan ditinjau langsung oleh dokter spesialis Zavora Life
          </p>
        </div>

        <Link
          href="/ai-screening"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition self-start shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" /> Tanya AI Seputar Artikel
        </Link>
      </div>

      {/* Search & Category Filter */}
      <section className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari topik kesehatan, gejala, atau nama dokter penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-emerald-600 text-white font-bold shadow-2xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Editorial Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-2">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Tidak ada artikel ditemukan</h3>
            <p className="text-xs text-slate-500">Coba ubah filter kategori atau kata kunci pencarian Anda.</p>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isBookmarked = bookmarkedIds.includes(article.id);

            return (
              <div
                key={article.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition p-5 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${article.tagColor}`}
                    >
                      {article.category}
                    </span>
                    <button
                      onClick={() => handleBookmarkToggle(article.id)}
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked
                          ? "text-emerald-600 bg-emerald-50"
                          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                      aria-label="Simpan Artikel"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-emerald-600" : ""}`} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-emerald-700 transition cursor-pointer">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                      {article.description}
                    </p>
                  </div>
                </div>

                {/* Author & Meta Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                      {article.author.replace(/^dr\.\s*/, "").charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-none">{article.author}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{article.authorRole}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                    <span className="flex items-center gap-1 hidden sm:inline-flex">
                      <Calendar className="w-3 h-3" /> {article.date}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
