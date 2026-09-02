"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { ArrowLeft, Send, Bot, User, AlertCircle } from "lucide-react";

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
      content: "Halo! Saya KlinikSehat AI. Silakan ceritakan keluhan medis atau gejala yang Anda rasakan saat ini. Saya akan membantu menganalisis dan merekomendasikan langkah selanjutnya."
    }
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

  // Cleanup SSE connection on unmount
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
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMessageId, role: "ai", content: "" }]);

    // Open SSE connection
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const userIdQuery = user?.id ? `&userId=${user.id}` : "";
    const streamUrl = `${apiUrl}/ai/consultation/stream?prompt=${encodeURIComponent(userMessage.content)}${userIdQuery}`;
    
    eventSourceRef.current = new EventSource(streamUrl);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.token) {
          setMessages(prev => prev.map(msg => 
            msg.id === aiMessageId 
              ? { ...msg, content: msg.content + data.token }
              : msg
          ));
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
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId && msg.content === ""
          ? { ...msg, content: "Maaf, terjadi kesalahan koneksi ke server AI." }
          : msg
      ));
    };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 flex items-center shadow-md rounded-b-3xl shrink-0 z-10 relative">
        <button onClick={() => router.back()} className="p-2 hover:bg-primary-500 rounded-full transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="ml-4 flex-1">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-200" />
            KlinikSehat AI
          </h1>
          <p className="text-[11px] text-primary-100 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Online - Medical Screening
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-orange-50 border-b border-orange-100 p-3 flex items-start gap-2 shrink-0">
        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
        <p className="text-[10px] text-orange-700 leading-tight">
          AI ini hanya memberikan analisis awal dan **bukan diagnosis medis definitif**. Segera hubungi dokter atau UGD jika dalam kondisi darurat.
        </p>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
            
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Bot className="w-5 h-5" />
              </div>
            )}
            
            <div 
              className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm
                ${msg.role === "user" 
                  ? "bg-primary-600 text-white rounded-tr-sm" 
                  : "bg-white border border-gray-100 text-gray-700 rounded-tl-sm"
                }
              `}
            >
              {msg.content || (msg.role === "ai" && isStreaming && (
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                </span>
              ))}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0 shadow-sm mt-1">
                <User className="w-5 h-5" />
              </div>
            )}

          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 shrink-0">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder="Tulis gejala atau keluhan Anda..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center shrink-0 shadow-md hover:bg-primary-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-md disabled:hover:bg-primary-600"
          >
            <Send className="w-5 h-5 ml-1" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AIScreeningPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center text-primary-600">Memuat AI...</div>}>
      <AIScreeningContent />
    </Suspense>
  );
}
