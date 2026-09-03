"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  Mail,
  User,
  HeartPulse,
  ThumbsUp,
  Menu,
  ChevronRight,
  Send,
  Paperclip,
  ChevronLeft,
  Phone,
  Video,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { BottomNav } from "@/components/layout/BottomNav";

interface DoctorChat {
  id: string;
  name: string;
  specialization: string;
  isOnline: boolean;
  price: string;
  originalPrice?: string;
  rating: string;
  reviews: string;
  avatarBg: string;
  initials: string;
}

const MOCK_DOCTORS: DoctorChat[] = [
  {
    id: "general",
    name: "Chat Dokter Umum",
    specialization: "Dokter Umum",
    isOnline: true,
    price: "Rp12.900",
    rating: "99%",
    reviews: "150rb+",
    avatarBg: "bg-gradient-to-tr from-blue-500 to-indigo-600",
    initials: "DU",
  },
  {
    id: "1",
    name: "dr. Natami Dewi Ratih, Sp.OG, M.Kes",
    specialization: "Spesialis Kandungan",
    isOnline: true,
    price: "Rp49.900",
    originalPrice: "Rp79.900",
    rating: "98%",
    reviews: "37,8rb",
    avatarBg: "bg-gradient-to-tr from-pink-500 to-rose-600",
    initials: "NR",
  },
  {
    id: "2",
    name: "dr. Marshalla Agnes, Sp.A",
    specialization: "Spesialis Anak",
    isOnline: true,
    price: "Rp49.900",
    originalPrice: "Rp79.900",
    rating: "97%",
    reviews: "4,9rb",
    avatarBg: "bg-gradient-to-tr from-amber-500 to-orange-600",
    initials: "MA",
  },
  {
    id: "3",
    name: "dr. Fatimah Fitriani Sp. DVE",
    specialization: "Spesialis Kulit",
    isOnline: true,
    price: "Rp49.900",
    rating: "99%",
    reviews: "12,1rb",
    avatarBg: "bg-gradient-to-tr from-purple-500 to-violet-600",
    initials: "FF",
  },
];

export default function DoctorChatDiscoveryPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorChat | null>(null);

  // If a doctor is selected, render active Chat Room UI
  if (selectedDoctor) {
    return <ChatRoom doctor={selectedDoctor} onBack={() => setSelectedDoctor(null)} />;
  }

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || doc.specialization.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "Semua") return matchesSearch;
    return matchesSearch && doc.specialization.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto relative">
      {/* Blue Top Header */}
      <div className="bg-gradient-to-b from-primary-600 to-primary-700 text-white p-4 pt-6 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between">
          <Link
            href="/profile/patient"
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm transition"
          >
            <ShieldCheck className="w-4 h-4 text-blue-200" />
            <span>Sambungkan Asuransi</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70" />
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition">
              <Mail className="w-5 h-5 text-white" />
            </button>
            <Link href="/profile/patient" className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition">
              <User className="w-5 h-5 text-white" />
            </Link>
          </div>
        </div>

        {/* Floating White Main Title Card */}
        <div className="bg-white text-gray-900 rounded-3xl p-4 mt-5 shadow-lg border border-gray-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-md shrink-0">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">Chat Bersama Dokter</h1>
            <p className="text-xs text-gray-500 mt-0.5">Chat dengan dokter umum dan spesialis</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Specialization Sub-Tabs */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
          <div className="flex gap-1 overflow-x-auto no-scrollbar text-xs font-semibold">
            {["Semua", "Kulit", "Anak", "Kandungan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-primary-50 text-primary-600 font-bold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 border-l border-gray-100 ml-1">
            <Menu className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama dokter atau spesialisasi"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-xs font-medium"
          />
        </div>

        {/* Kemenkes Banner */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-2.5 flex items-center justify-center gap-2 text-[11px] text-emerald-800 font-semibold shadow-xs">
          <div className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white text-[9px] font-bold">+</div>
          <span>Dibina oleh KEMENTERIAN KESEHATAN REPUBLIK INDONESIA</span>
        </div>

        {/* Doctor Consultation Cards List */}
        <div className="space-y-3">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-3 hover:border-primary-100 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div className="relative shrink-0">
                    <div className={`w-14 h-14 rounded-2xl ${doc.avatarBg} text-white flex items-center justify-center font-bold text-lg shadow-inner`}>
                      {doc.initials}
                    </div>
                    {doc.isOnline && (
                      <span className="w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full absolute -top-0.5 -right-0.5"></span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{doc.name}</h3>
                    {doc.isOnline && (
                      <span className="inline-block text-[10px] font-bold text-emerald-600 mt-0.5">
                        🟢 Online
                      </span>
                    )}
                    <p className="text-xs text-gray-500 font-medium">{doc.specialization}</p>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-bold text-primary-600 text-xs">{doc.price}</span>
                      {doc.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">{doc.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDoctor(doc)}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-2xl shadow-sm transition shrink-0 active:scale-95"
                >
                  Mulai Chat
                </button>
              </div>

              {/* Stats Footer */}
              <div className="pt-2.5 border-t border-gray-50 flex items-center gap-6 text-[11px] text-gray-500 font-medium">
                <div>
                  <span className="text-gray-400 block text-[10px]">Kepuasan Pasien</span>
                  <div className="flex items-center gap-1 font-bold text-gray-800 mt-0.5">
                    <ThumbsUp className="w-3.5 h-3.5 text-primary-600 fill-primary-100" />
                    <span>{doc.rating}</span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">Jumlah Ulasan</span>
                  <span className="font-bold text-gray-800 block mt-0.5">{doc.reviews}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function ChatRoom({ doctor, onBack }: { doctor: DoctorChat; onBack: () => void }) {
  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "system",
      text: "Sesi telekonsultasi terenkripsi telah dimulai. Percakapan ini dilindungi oleh standar privasi data medis Zavora Life.",
      time: "10:00",
    },
    {
      id: "2",
      sender: "doctor",
      text: `Halo! Selamat datang di Zavora Life. Saya ${doctor.name}. Ada keluhan kesehatan apa yang bisa saya bantu hari ini?`,
      time: "10:01",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "doctor",
          text: "Baik, bisa jelaskan sejak kapan gejala ini dirasakan dan apakah ada riwayat alergi obat?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-xs sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative">
            <div className={`w-10 h-10 rounded-full ${doctor.avatarBg} text-white flex items-center justify-center font-bold text-sm`}>
              {doctor.initials}
            </div>
            <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-900 leading-tight">{doctor.name}</h2>
            <p className="text-[10px] text-emerald-600 font-medium">Sedang Online • Consultation</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-500">
          <button className="p-2 hover:bg-gray-100 rounded-full text-primary-600">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-primary-600">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Safety Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2 text-[10px] text-amber-800">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
        <span>Darurat? Hubungi 119 atau kunjungi IGD terdekat.</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          if (msg.sender === "system") {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="bg-gray-200/60 text-gray-600 text-[10px] px-3 py-1 rounded-full">
                  {msg.text}
                </span>
              </div>
            );
          }

          const isUser = msg.sender === "user";
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                  isUser ? "bg-primary-600 text-white rounded-br-xs" : "bg-white text-gray-800 border border-gray-100 rounded-bl-xs"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span className={`text-[9px] block text-right mt-1 ${isUser ? "text-primary-100" : "text-gray-400"}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1 text-xs text-gray-400 italic py-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="ml-1 text-[10px]">Dokter sedang mengetik...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <button className="p-2 text-gray-400 hover:text-primary-600 rounded-xl hover:bg-gray-100">
          <Paperclip className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="Ketik pesan konsultasi Anda..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
