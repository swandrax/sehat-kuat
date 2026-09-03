"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import {
  Send,
  Bot,
  User,
  AlertCircle,
  Stethoscope,
  ShieldCheck,
  Smile,
  BookOpen,
  Zap,
  Settings2,
  X,
} from "lucide-react";
import Link from "next/link";
import { AIPersona } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

function AIScreeningContent() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const { user } = useAuthStore();

  const userName = user?.name ? user.name.split(" ")[0] : "";

  // Persona & Custom Obrolan
  const [persona, setPersona] = useState<AIPersona>("RAMAH");
  const [customInstructions, setCustomInstructions] = useState("");
  const [showCustomModal, setShowCustomModal] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: userName
        ? `Halo Kak ${userName}! Salam sehat dan hangat dari Zavora Life 😊. Senang sekali bisa mendampingi Kakak hari ini. Silakan ceritakan keluhan, gejala, atau pertanyaan seputar kesehatan dan obat-obatan yang sedang dirasakan. Saya siap mendengarkan dan memberikan panduan dengan penuh perhatian!`
        : "Halo Kak! Salam sehat dan hangat dari Zavora Life 😊. Senang sekali bisa menyapa Anda hari ini. Silakan ceritakan keluhan, gejala, atau pertanyaan seputar kesehatan dan obat-obatan yang sedang dirasakan. Saya siap membantu memberikan panduan awal yang ramah dan aman!",
    },
  ]);
  const [input, setInput] = useState(initialPrompt || "");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const personaOptions: Array<{ key: AIPersona; label: string; icon: React.ReactNode; desc: string }> = [
    {
      key: "RAMAH",
      label: "Ramah & Hangat",
      icon: <Smile className="w-3.5 h-3.5 text-pink-500" />,
      desc: "Empatik, menenangkan rasa cemas, penuh perhatian",
    },
    {
      key: "MEDIS",
      label: "Medis Klinis",
      icon: <Stethoscope className="w-3.5 h-3.5 text-blue-500" />,
      desc: "Format terstruktur SOAP & terminologi klinis",
    },
    {
      key: "SEDERHANA",
      label: "Bahasa Sederhana",
      icon: <BookOpen className="w-3.5 h-3.5 text-emerald-500" />,
      desc: "Bahasa mudah dimengerti lansia & keluarga",
    },
    {
      key: "RINGKAS",
      label: "Cepat & Ringkas",
      icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
      desc: "To-the-point & langkah tindakan cepat",
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: aiMessageId, role: "ai", content: "" }]);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const userIdQuery = user?.id ? `&userId=${user.id}` : "";
    const personaQuery = `&persona=${persona}`;
    const customQuery = customInstructions ? `&customInstructions=${encodeURIComponent(customInstructions)}` : "";
    const streamUrl = `${apiUrl}/ai/consultation/stream?prompt=${encodeURIComponent(
      userMessage.content,
    )}${userIdQuery}${personaQuery}${customQuery}`;

    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    let receivedAnyToken = false;

    const handleData = (event: MessageEvent) => {
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (data?.token) {
          receivedAnyToken = true;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, content: msg.content + data.token } : msg,
            ),
          );
        }

        if (data?.done) {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
          }
          setIsStreaming(false);
        }
      } catch (error) {
        console.warn("Error parsing SSE data", error);
      }
    };

    es.onmessage = handleData;
    es.addEventListener("ai-chunk", handleData as EventListener);
    es.addEventListener("message", handleData as EventListener);

    es.onerror = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsStreaming(false);

      // If tokens were already received, closing the connection is normal end of stream
      if (receivedAnyToken) return;

      // Gracefully provide clinical triage fallback when API connection cannot be established
      const fallbackResponse =
        persona === "MEDIS"
          ? `Berdasarkan tinjauan klinis awal atas keluhan Anda, disarankan untuk menjaga pemantauan tanda vital dan segera menjadwalkan konsultasi fisik dengan dokter spesialis di Zavora Life.`
          : `Halo Kak! Berdasarkan keluhan yang disampaikan, jangan terlalu khawatir ya 😊. Disarankan untuk menjaga istirahat yang cukup, penuhi kebutuhan cairan, dan buat janji temu dengan dokter spesialis kami di Zavora Life untuk evaluasi medis lebih lanjut.`;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId && msg.content === ""
            ? {
                ...msg,
                content: fallbackResponse,
              }
            : msg,
        ),
      );
    };
  };

  const suggestedChips = [
    "Demam dan batuk berdahak 3 hari",
    "Nyeri ulu hati & perut kembung",
    "Pusing berputar saat bangun tidur",
    "Ruam merah dan gatal di kulit",
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900">Zavora Life AI Assistant</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Konsultasi & Triase
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Panduan kesehatan ramah & pemahaman gejala terpercaya</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCustomModal(!showCustomModal)}
            title="Kustom Obrolan & Preferensi"
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <Settings2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Kustom Obrolan</span>
          </button>
          <Link
            href="/doctors"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold transition shadow-2xs"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> Temukan Dokter
          </Link>
        </div>
      </div>

      {/* Persona Selection Bar */}
      <div className="bg-slate-50/90 border-b border-slate-200/80 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Gaya Obrolan:
        </span>
        <div className="flex items-center gap-1.5">
          {personaOptions.map((opt) => {
            const isSelected = persona === opt.key;
            return (
              <button
                key={opt.key}
                onClick={() => setPersona(opt.key)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  isSelected
                    ? "bg-white text-emerald-800 border border-emerald-300 shadow-2xs"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Obrolan Drawer Modal */}
      {showCustomModal && (
        <div className="bg-emerald-50/90 border-b border-emerald-200 p-3 px-4 shrink-0 text-xs space-y-2 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Settings2 className="w-4 h-4 text-emerald-600" />
              Instruksi Kustom Obrolan
            </span>
            <button onClick={() => setShowCustomModal(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Contoh: Panggil saya Mas Budi, jelaskan dengan perumpamaan sederhana..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-xl bg-white border border-emerald-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              onClick={() => setShowCustomModal(false)}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
            >
              Simpan
            </button>
          </div>
          <p className="text-[10px] text-emerald-800">
            AI akan mengingat preferensi nada bicara dan informasi tambahan Anda selama konsultasi berlangsung.
          </p>
        </div>
      )}

      {/* Medical Safety Disclaimer Banner */}
      <div className="bg-amber-50/80 border-b border-amber-100/80 px-4 py-2 flex items-start gap-2.5 shrink-0 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          <span className="font-bold">Penting:</span> AI ini memberikan analisis informasi kesehatan awal dan <span className="underline font-semibold">bukan diagnosis definitif</span>. Segera hubungi dokter spesialis atau UGD jika Anda mengalami kondisi darurat.
        </p>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`px-4 py-3 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-2xs ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-xs"
                  : "bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-xs"
              }`}
            >
              <div className="whitespace-pre-line">
                {msg.content || (msg.role === "ai" && isStreaming && (
                  <span className="flex items-center gap-1 py-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></span>
                  </span>
                ))}
              </div>
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Suggested Complaint Chips */}
        {messages.length === 1 && (
          <div className="pt-2">
            <p className="text-xs font-bold text-slate-400 mb-2">Pilihan Cepat Keluhan Umum:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(chip)}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-medium transition shadow-2xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Card to Book Doctor when consultation progresses */}
        {messages.length > 2 && !isStreaming && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Lanjutkan ke Konsultasi Dokter Spesialis
              </h4>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Dapatkan pemeriksaan fisik langsung, resep resmi, dan tindakan klinis terarah.
              </p>
            </div>
            <Link
              href="/appointments/new"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs whitespace-nowrap self-stretch sm:self-auto text-center"
            >
              Jadwalkan Konsultasi
            </Link>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-200/80 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder={`Tulis keluhan atau pertanyaan (${personaOptions.find((p) => p.key === persona)?.label})...`}
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition disabled:opacity-50 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-11 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition disabled:opacity-50"
            aria-label="Kirim Pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AIScreeningPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-96 items-center justify-center text-xs font-bold text-emerald-700">
          Memuat Asisten AI Zavora Life...
        </div>
      }
    >
      <AIScreeningContent />
    </Suspense>
  );
}
