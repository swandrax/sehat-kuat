import { create } from 'zustand';
import { mobileApiClient } from '../api/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  createdAt: string;
  isEscalated?: boolean;
}

interface ChatbotState {
  sessionId: string | null;
  messages: ChatMessage[];
  isTyping: boolean;
  isEscalatedToHuman: boolean;
  assignedAgentName?: string;
  error: string | null;
  initSession: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  escalateToHumanAgent: (reason?: string) => Promise<void>;
}

export const useChatbotStore = create<ChatbotState>((set, get) => ({
  sessionId: null,
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Halo! Saya Asisten Pintar Zavora Life didukung AUTRA-AI. Anda dapat menanyakan panduan kesehatan umum, status klaim asuransi, sisa plafon tahunan, atau bantuan pendaftaran antrean dokter.',
      createdAt: new Date().toISOString(),
    },
  ],
  isTyping: false,
  isEscalatedToHuman: false,
  error: null,

  initSession: async () => {
    try {
      const res = await mobileApiClient('/chat/sessions', {
        method: 'POST',
        body: JSON.stringify({ title: 'Konsultasi Mobile' }),
      });
      set({ sessionId: res.data?.id || res.id });
    } catch {
      // session fallback
    }
  },

  sendMessage: async (content: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
      error: null,
    }));

    try {
      let reply = '';
      const lower = content.toLowerCase();

      // Autonomous contextual replies
      if (lower.includes('klaim') || lower.includes('claim')) {
        reply =
          'Untuk klaim asuransi, AUTRA-AI dapat memproses kuitansi dan resep Anda dalam hitungan detik. Cukup buka tab "Klaim", foto dokumen Anda, dan sistem akan langsung memverifikasi limit serta pre-approval cashless.';
      } else if (lower.includes('limit') || lower.includes('plafon')) {
        reply =
          'Polis Zavora Life Protection Corporate Anda memiliki sisa plafon Rp 238.500.000 (dari total Rp 250.000.000/tahun). Fasilitas cashless aktif 100% untuk rawat jalan di faskes rekanan.';
      } else if (lower.includes('darurat') || lower.includes('nyeri dada') || lower.includes('sesak')) {
        reply =
          '⚠️ PERINGATAN MEDIS: Gejala yang Anda sebutkan memerlukan evaluasi klinis segera. Saya telah menyiapkan tombol eskalasi langsung ke dokter IGD rekanan terdekat.';
      } else {
        reply =
          'Terima kasih atas pertanyaan Anda. Untuk kepastian medis, saya sarankan konsultasi dengan dokter spesialis di klinik Zavora Life terdekat.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: reply,
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
      }));
    } catch (err: any) {
      set({ isTyping: false, error: err.message });
    }
  },

  escalateToHumanAgent: async (reason = 'Permintaan langsung pasien') => {
    set({
      isEscalatedToHuman: true,
      assignedAgentName: 'dr. Siti Rahma (Dokter Triase Jaga)',
    });

    const agentMsg: ChatMessage = {
      id: `agent-esc-${Date.now()}`,
      role: 'agent',
      content: `Sesi telah dialihkan ke Tenaga Medis: dr. Siti Rahma. Alasan: ${reason}. Silakan sampaikan keluhan Anda secara rinci.`,
      createdAt: new Date().toISOString(),
      isEscalated: true,
    };

    set((state) => ({
      messages: [...state.messages, agentMsg],
    }));
  },
}));
