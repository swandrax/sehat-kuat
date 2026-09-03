"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Send,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Stethoscope,
  BookOpen,
  Zap,
  Settings2,
  Users,
  FileText,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export type AIPersona = "RAMAH" | "MEDIS" | "SEDERHANA" | "RINGKAS";

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

  // Persona & Custom Obrolan state
  const [persona, setPersona] = useState<AIPersona>("RAMAH");
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [customInstructions, setCustomInstructions] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);

  const userName = user?.name ? user.name.split(" ")[0] : "";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      sender: "assistant",
      text: userName
        ? `Halo Kak ${userName}! Salam sehat dan hangat dari Zavora Life 😊. Senang bisa mendampingi Kakak hari ini. Ada keluhan kesehatan, pertanyaan obat, atau jadwal dokter yang ingin didiskusikan? Saya siap membantu dengan senang hati!`
        : "Halo Kak! Salam sehat dan hangat dari Zavora Life 😊. Senang bisa menyapa Anda hari ini. Ada keluhan kesehatan atau informasi faskes dan jadwal dokter yang bisa saya bantu?",
      timestamp: "Baru saja",
      feedbackState: "HIDDEN",
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

  const personaConfig: Record<AIPersona, { label: string; icon: React.ReactNode; badge: string; color: string; desc: string }> = {
    RAMAH: {
      label: "Ramah & Hangat",
      icon: <Smile className="w-3 h-3 text-pink-500" />,
      badge: "Ramah",
      color: "from-pink-500 to-rose-500",
      desc: "Bahasa santun, penuh empati, menenangkan rasa cemas.",
    },
    MEDIS: {
      label: "Medis Klinis",
      icon: <Stethoscope className="w-3 h-3 text-blue-500" />,
      badge: "Klinis",
      color: "from-blue-600 to-indigo-600",
      desc: "Format terstruktur SOAP dan terminologi kesehatan komprehensif.",
    },
    SEDERHANA: {
      label: "Bahasa Sederhana",
      icon: <BookOpen className="w-3 h-3 text-emerald-500" />,
      badge: "Sederhana",
      color: "from-emerald-600 to-teal-600",
      desc: "Bahasa mudah dipahami lansia, keluarga, dan anak-anak.",
    },
    RINGKAS: {
      label: "Cepat & Ringkas",
      icon: <Zap className="w-3 h-3 text-amber-500" />,
      badge: "Ringkas",
      color: "from-amber-500 to-orange-500",
      desc: "Jawaban to-the-point dan langkah praktis cepat.",
    },
  };

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

      // Panggil friendly chat endpoint yang mendukung custom persona dan inter-user context
      const res = await fetch(`${apiUrl}/ai/friendly-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          persona,
          customInstructions: customInstructions || undefined,
        }),
      });

      let replyText = "";
      if (res.ok) {
        const json = await res.json();
        replyText = json?.reply || json?.data?.reply;
      }

      if (!replyText) {
        // Fallback local friendly generator
        replyText =
          persona === "MEDIS"
            ? `Berdasarkan keluhan "${text}":\n- Subjektif: Gejala dilaporkan oleh pasien.\n- Rekomendasi: Disarankan evaluasi langsung dengan dokter spesialis terkait di Zavora Life untuk penegakan diagnosis fisik.`
            : `Halo Kak! Salam hangat dari Zavora Life 😊.\n\nMengenai "${text}", jangan terlalu khawatir ya. Langkah awal yang baik adalah istirahat cukup dan jaga asupan air putih hangat. Sangat disarankan untuk berkonsultasi langsung dengan dokter spesialis kami di Zavora Life agar mendapatkan penanganan terbaik. Semoga lekas sehat kembali!`;
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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          sender: "assistant",
          text: `Halo Kak! Terima kasih sudah menceritakan keluhan Anda. Disarankan untuk beristirahat cukup dan segera berkonsultasi langsung dengan dokter kami di Zavora Life untuk pemeriksaan medis yang akurat ya 😊.`,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          feedbackState: "UNREVIEWED",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate Co-Pilot Summary (Rangkuman Dokter / Pasien)
  const handleGenerateCoPilot = (audience: "DOCTOR" | "PATIENT") => {
    const assistantMsgId = `ast-${Date.now()}`;
    const userPrompts = messages.filter((m) => m.sender === "user").map((m) => m.text);
    const lastUserPrompt = userPrompts[userPrompts.length - 1] || "Keluhan kesehatan umum";

    let summary = "";
    if (audience === "DOCTOR") {
      summary = `🩺 **Ringkasan Medis Pasien untuk Dokter (AI Co-Pilot)**:\n\n- **Keluhan Utama**: ${lastUserPrompt}\n- **Persona Interaksi**: ${personaConfig[persona].label}\n- **Catatan**: Pasien kooperatif, disarankan verifikasi riwayat alergi, durasi gejala, dan pemeriksaan fisik di ruang konsultasi.`;
    } else {
      summary = `🌸 **Rangkuman Ramah untuk Kakak (AI Co-Pilot)**:\n\n1. Selalu jaga istirahat yang berkualitas dan jangan stres ya.\n2. Catat kapan gejala muncul untuk disampaikan saat bertemu dokter.\n3. Jika ada tanda gawat darurat (sesak parah, nyeri dada hebat), segera kunjungi UGD terdekat.\n\nSemoga lekas sembuh dan ceria kembali! 😊`;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        sender: "assistant",
        text: summary,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        feedbackState: "UNREVIEWED",
      },
    ]);
  };

  // Feedback handler (Like / Unlike)
  const handleFeedback = async (messageId: string, feedback: "LIKE" | "UNLIKE") => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, feedbackState: feedback === "LIKE" ? "LIKED" : "UNLIKED" }
          : m
      )
    );

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
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-500/50 animate-pulse pointer-events-none"></span>
          <Image
            src="/logo-zavora.png"
            alt="Zavora Life AI"
            width={36}
            height={36}
            className="w-full h-full object-contain relative z-10 drop-shadow-xs"
          />
          <span className="absolute top-1 right-1 w-3 h-3 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full z-20"></span>
        </button>
      )}

      {/* 2. Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 max-w-sm h-[540px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="p-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
                <Image src="/logo-zavora.png" alt="Zavora" width={28} height={28} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <h3 className="text-xs font-black tracking-tight text-white">ZAVORA LIFE AI</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping"></span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-100 font-medium mt-0.5">
                  <span>Mode:</span>
                  <button
                    onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                    className="underline underline-offset-2 flex items-center gap-0.5 font-bold hover:text-white"
                  >
                    {personaConfig[persona].badge}
                    <ChevronDown className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowCustomModal(!showCustomModal)}
                title="Sesuaikan Gaya & Catatan Obrolan"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Tutup Asisten AI"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Persona Menu Dropdown */}
          {showPersonaMenu && (
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-2.5 shadow-md z-10 shrink-0 space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                Pilih Karakter Asisten AI:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(personaConfig) as AIPersona[]).map((key) => {
                  const cfg = personaConfig[key];
                  const isSelected = persona === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setPersona(key);
                        setShowPersonaMenu(false);
                      }}
                      className={`flex items-center gap-1.5 p-1.5 rounded-xl text-left text-xs transition ${
                        isSelected
                          ? "bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 font-bold text-emerald-900 dark:text-emerald-200"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {cfg.icon}
                      <span className="text-[11px] truncate">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Obrolan / Notes Modal Drawer */}
          {showCustomModal && (
            <div className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 p-3 shrink-0 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Settings2 className="w-3.5 h-3.5 text-emerald-600" />
                  Instruksi Kustom Obrolan
                </span>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                placeholder="Contoh: Panggil saya Mas Budi, jelaskan dengan analogi simpel..."
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                className="w-full text-xs p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                AI akan mengingat preferensi nada bicara dan nama panggilan Anda selama obrolan.
              </p>
            </div>
          )}

          {/* Co-Pilot Inter-user Quick Action Bar */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-900/40 px-3 py-1.5 flex items-center justify-between gap-1 text-[10px] text-emerald-800 dark:text-emerald-300 shrink-0">
            <span className="font-semibold flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-600" />
              Bantuan AI Co-Pilot:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleGenerateCoPilot("DOCTOR")}
                title="Rangkum riwayat keluhan untuk dokter"
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 font-bold transition flex items-center gap-1"
              >
                <FileText className="w-2.5 h-2.5 text-blue-600" /> Untuk Dokter
              </button>
              <button
                onClick={() => handleGenerateCoPilot("PATIENT")}
                title="Rangkum poin penting untuk pasien"
                className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 font-bold transition flex items-center gap-1"
              >
                <Smile className="w-2.5 h-2.5 text-pink-600" /> Tips Saya
              </button>
            </div>
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
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right mt-1 ${
                      msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* AI Response Feedback */}
                {msg.sender === "assistant" && msg.feedbackState && msg.feedbackState !== "HIDDEN" && (
                  <div className="mt-1 pt-0.5 flex items-center gap-1.5 transition-all duration-300">
                    {msg.feedbackState === "UNREVIEWED" && (
                      <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 shadow-2xs">
                        <button
                          onClick={() => handleFeedback(msg.id, "LIKE")}
                          title="Jawaban ini ramah & bermanfaat"
                          className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:scale-115 active:scale-95 transition-transform"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <span className="text-slate-300 dark:text-slate-600 text-[10px]">|</span>
                        <button
                          onClick={() => handleFeedback(msg.id, "UNLIKE")}
                          title="Jawaban ini kurang pas"
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:scale-115 active:scale-95 transition-transform"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {msg.feedbackState === "LIKED" && (
                      <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 animate-in zoom-in duration-200">
                        <ThumbsUp className="w-3 h-3 fill-current" />
                        <span>Senang bisa membantu Kakak 😊</span>
                      </div>
                    )}

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
              placeholder={`Ketik pesan (${personaConfig[persona].badge})...`}
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
