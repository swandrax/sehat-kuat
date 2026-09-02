"use client";

import { useState } from "react";
import {
  Send,
  Paperclip,
  ShieldAlert,
  Phone,
  Video,
  ChevronLeft,
  Bot,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";

interface Message {
  id: string;
  sender: "user" | "doctor" | "system";
  text: string;
  time: string;
}

export default function ConsultationChatPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "system",
      text: "Sesi konsultasi terenkripsi telah dimulai. Percakapan ini dilindungi oleh standar keamanan data medis KlinikSehat.",
      time: "10:00",
    },
    {
      id: "2",
      sender: "doctor",
      text: "Halo! Selamat pagi. Saya dr. Budi Santoso, Sp.PD. Ada keluhan apa yang bisa saya bantu hari ini?",
      time: "10:01",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Simulate doctor typing response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "doctor",
          text: "Baik, apakah keluhan tersebut disertai demam atau rasa mual dalam 2 hari terakhir?",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] bg-gray-50">
      {/* Top Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="w-3 h-3 bg-emerald-500 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 leading-tight">dr. Budi Santoso, Sp.PD</h2>
            <p className="text-[11px] text-emerald-600 font-medium">Sedang Online • Konsultasi Aktif</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500">
          <button className="p-2 hover:bg-gray-100 rounded-full text-primary-600">
            <Phone className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full text-primary-600">
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2 text-[11px] text-amber-800">
        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
        <span>Jika Anda mengalami kondisi darurat yang mengancam jiwa, segera hubungi 119 atau kunjungi IGD terdekat.</span>
      </div>

      {/* Chat Messages Area */}
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
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                  isUser
                    ? "bg-primary-600 text-white rounded-br-xs"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-xs"
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span
                  className={`text-[9px] block text-right mt-1 ${
                    isUser ? "text-primary-100" : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 italic py-1">
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            <span className="ml-1 text-[11px]">dr. Budi sedang mengetik...</span>
          </div>
        )}
      </div>

      {/* Quick Suggestion Pills */}
      <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
        <button
          onClick={() => setInput("Saya sudah minum obat paracetamol tapi belum membaik.")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap"
        >
          Sudah minum obat tapi belum membaik
        </button>
        <button
          onClick={() => setInput("Keluhan ini sudah berlangsung sejak kemarin.")}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full whitespace-nowrap"
        >
          Sudah sejak kemarin
        </button>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
        <button className="p-2.5 text-gray-400 hover:text-primary-600 rounded-xl hover:bg-gray-100 transition">
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder="Ketik pesan konsultasi Anda..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
        />

        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-primary-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
