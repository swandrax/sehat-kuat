import { create } from 'zustand';

export interface HealthRecommendation {
  id: string;
  category: 'PREVENTIVE' | 'MEDICATION_ADHERENCE' | 'WELLNESS' | 'INSURANCE_PERK';
  title: string;
  description: string;
  actionText: string;
  actionRoute: string;
  severity: 'INFO' | 'RECOMMENDED' | 'CRITICAL';
}

interface RecommendationsState {
  recommendations: HealthRecommendation[];
  wellnessScore: number;
  fetchRecommendations: () => void;
  dismissRecommendation: (id: string) => void;
}

export const useRecommendationsStore = create<RecommendationsState>((set) => ({
  wellnessScore: 88,
  recommendations: [
    {
      id: 'rec-1',
      category: 'INSURANCE_PERK',
      title: 'Skrining Gula Darah Tahunan Gratis',
      description: 'Polis Zavora Life Anda mencakup pemeriksaan laboratorium HbA1c dan profil lipid gratis 1x setahun.',
      actionText: 'Klaim Voucher Faskes',
      actionRoute: 'Discovery',
      severity: 'RECOMMENDED',
    },
    {
      id: 'rec-2',
      category: 'MEDICATION_ADHERENCE',
      title: 'Jadwal Obat Rutin: Metformin 500mg',
      description: 'Minum 1 tablet setelah sarapan pagi untuk menjaga kadar gula darah stabil.',
      actionText: 'Lihat E-Resep',
      actionRoute: 'Records',
      severity: 'INFO',
    },
    {
      id: 'rec-3',
      category: 'PREVENTIVE',
      title: 'Vaksinasi Influenza Musiman',
      description: 'Dapatkan perlindungan flu di RS Citra Harapan dengan diskon klaim cashless 100%.',
      actionText: 'Daftar Sekarang',
      actionRoute: 'Discovery',
      severity: 'INFO',
    },
  ],

  fetchRecommendations: () => {
    // In production, syncs with backend AI health recommendation engine
  },

  dismissRecommendation: (id: string) => {
    set((state) => ({
      recommendations: state.recommendations.filter((r) => r.id !== id),
    }));
  },
}));
