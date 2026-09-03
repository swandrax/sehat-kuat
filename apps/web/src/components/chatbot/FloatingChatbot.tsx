"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Send,
  Sparkles,
  Bot,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  AlertCircle,
  Minimize2,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  feedbackState?: "UNREVIEWED" | "SUBMITTING" | "LIKED" | "UNLIKED" | "HIDDEN";
}

export function FloatingChatbot() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId] = useState(() => `conv-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Halo! Saya Zavora Life AI Assistant. Ada keluhan kesehatan atau informasi faskes dan jadwal dokter yang bisa saya bantu?",
      timestamp: "Baru saja",
      feedbackState: "HIDDEN", // Welcome message doesn't need rating
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  // Send message handler
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputMessage.trim();
    if (!text || isTyping) return;

    const userMsgId = `usr-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      },
    ];

    setMessages(newMessages);
    setInputMessage("");
    setIsTyping(true);

    const assistantMsgId = `ast-${Date.now()}`;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      // Try triage/consultation endpoint
      const res = await fetch(`${apiUrl}/ai/triage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: text }),
      });

      let replyText = "";
      if (res.ok) {
        const json = await res.json();
        replyText =
          json?.summary ||
          json?.data?.summary ||
          json?.assessment ||
          `Berdasarkan informasi Anda, disarankan untuk istirahat yang cukup, hidrasi teratur, dan melakukan konsultasi langsung dengan dokter spesialis di Zavora Life untuk pemeriksaan fisik lebih lanjut.`;
      } else {
        replyText = `Terima kasih atas informasinya. Untuk keluhan ini, Anda disarankan untuk memeriksakan diri ke dokter spesialis terkait di fasilitas kesehatan Zavora Life terdekat.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          sender: "assistant",
          text: replyText,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          feedbackState: "UNREVIEWED",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          sender: "assistant",
          text: "Untuk keluhan kesehatan Anda, kami menyarankan konsultasi langsung dengan dokter spesialis kami atau mengunjungi klinik terdekat.",
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          feedbackState: "UNREVIEWED",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Feedback handler (Like / Unlike)
  const handleFeedback = async (messageId: string, feedback: "LIKE" | "UNLIKE") => {
    // 1. Immediately disable and set animating state
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, feedbackState: feedback === "LIKE" ? "LIKED" : "UNLIKED" }
          : m
      )
    );

    // 2. Submit to backend API
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
      await fetch(`${apiUrl}/ai/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          messageId,
          feedback,
        }),
      });
    } catch (e) {
      console.warn("Feedback submission error:", e);
    }

    // 3. Smooth transition to hidden after brief confirmation (600ms)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, feedbackState: "HIDDEN" } : m))
      );
    }, 700);
  };

  return (
    <div className="select-none">
      {/* 1. Floating Circular Button in Bottom-Right Corner */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Buka Zavora Life AI Assistant"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center p-2.5 border-2 border-white/80 dark:border-slate-800 focus:outline-hidden focus:ring-4 focus:ring-emerald-500/40 group"
        >
          {/* Subtle glowing ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-500/50 animate-pulse pointer-events-none"></span>

          {/* Zavora Life Logo Emblem */}
          <img
            src="/logo-zavora.png"
            alt="Zavora Life AI"
            className="w-full h-full object-contain relative z-10 drop-shadow-xs"
          />

          {/* Active Online Ping */}
          <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full z-20"></span>
        </button>
      )}

      {/* 2. Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-w-sm h-[520px] max-h-[82vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
                <img src="/logo-zavora.png" alt="Zavora" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <h3 className="text-xs font-black tracking-tight text-white">ZAVORA LIFE AI</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                </div>
                <p className="text-[10px] text-emerald-100 font-medium mt-0.5">
                  Asisten Medis & Skrining
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Tutup Asisten AI"
              className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-100 dark:border-emerald-800/40 px-3 py-1.5 flex items-start gap-2 text-[10px] text-emerald-900 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-tight">
              Panduan kesehatan umum & skrining awal, bukan diagnosis pengganti dokter.
            </p>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-slate-50/50 dark:bg-[#090d16]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                {/* Bubble */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === "user"
                      ? "bg-emerald-600 text-white rounded-br-xs"
                      : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-bl-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 ${
                      msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* AI Response Feedback (Like 👍 / Unlike 👎) */}
                {msg.sender === "assistant" && msg.feedbackState && msg.feedbackState !== "HIDDEN" && (
                  <div className="mt-1 pt-0.5 flex items-center gap-1.5 transition-all duration-300">
                    {msg.feedbackState === "UNREVIEWED" && (
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 shadow-2xs">
                        <button
                          onClick={() => handleFeedback(msg.id, "LIKE")}
                          aria-label="Bermanfaat (Like)"
                          title="Jawaban ini bermanfaat"
                          className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-115 active:scale-95 transition-transform"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <span className="text-slate-300 dark:text-slate-600 text-[10px]">|</span>
                        <button
                          onClick={() => handleFeedback(msg.id, "UNLIKE")}
                          aria-label="Kurang Bermanfaat (Unlike)"
                          title="Jawaban ini kurang sesuai"
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:scale-115 active:scale-95 transition-transform"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Like Confirmation Animation */}
                    {msg.feedbackState === "LIKED" && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 animate-in zoom-in duration-200">
                        <ThumbsUp className="w-3 h-3 fill-current" />
                        <span>Terima kasih atas masukannya</span>
                      </div>
                    )}

                    {/* Unlike Confirmation Animation */}
                    {msg.feedbackState === "UNLIKED" && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 animate-in zoom-in duration-200">
                        <ThumbsDown className="w-3 h-3 fill-current" />
                        <span>Masukan dicatat untuk evaluasi</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700">
                  <Bot className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Tulis keluhan atau pertanyaan..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-750 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              aria-label="Kirim Pesan"
              className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl transition shadow-2xs active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
