"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  AlertCircle,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Calendar,
  Activity,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

function AIScreeningContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("prompt");
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Halo! Saya Asisten AI Kesehatan Zavora Life. Silakan ceritakan keluhan, gejala, atau pertanyaan seputar kesehatan dan obat-obatan yang Anda rasakan. Saya akan memberikan analisis awal dan rekomendasi langkah medis yang tepat.",
    },
  ]);
  const [input, setInput] = useState(initialPrompt || "");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

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
    const streamUrl = `${apiUrl}/ai/consultation/stream?prompt=${encodeURIComponent(
      userMessage.content,
    )}${userIdQuery}`;

    eventSourceRef.current = new EventSource(streamUrl);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.token) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId ? { ...msg, content: msg.content + data.token } : msg,
            ),
          );
        }

        if (data.done) {
          if (eventSourceRef.current) {
            eventSourceRef.current.close();
          }
          setIsStreaming(false);
        }
      } catch (error) {
        console.error("Error parsing SSE data", error);
      }
    };

    eventSourceRef.current.onerror = (error) => {
      console.error("SSE Error:", error);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      setIsStreaming(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId && msg.content === ""
            ? {
                ...msg,
                content:
                  "Berdasarkan keluhan yang Anda sampaikan, disarankan untuk menjaga istirahat yang cukup, penuhi kebutuhan cairan, dan buat janji temu dengan dokter spesialis kami di Zavora Life untuk evaluasi medis lebih lanjut.",
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
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900">Zavora Life AI Health Assistant</h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Medical Screening
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Panduan triase awal & pemahaman gejala terpercaya</p>
          </div>
        </div>

        <Link
          href="/doctors"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 rounded-xl text-xs font-bold transition shadow-2xs"
        >
          <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> Temukan Dokter
        </Link>
      </div>

      {/* Medical Safety Disclaimer Banner */}
      <div className="bg-amber-50/80 border-b border-amber-100/80 px-4 py-2.5 flex items-start gap-2.5 shrink-0 text-xs text-amber-900">
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

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {/* Suggested Quick Question Chips */}
        {messages.length <= 2 && !isStreaming && (
          <div className="pt-3">
            <p className="text-[11px] font-bold text-slate-400 mb-2 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Pertanyaan & Keluhan Sering Diajukan:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
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
            placeholder="Tulis keluhan kesehatan, gejala, atau pertanyaan obat..."
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
