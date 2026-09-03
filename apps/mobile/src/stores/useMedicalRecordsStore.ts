import { create } from 'zustand';
import { mobileApiClient } from '../api/client';

export interface MedicalRecordItem {
  id: string;
  chiefComplaint: string;
  clinicalNotes?: string;
  treatment?: string;
  createdAt: string;
  doctor?: { user?: { name: string } };
  diagnoses?: Array<{ code?: string; name: string }>;
  prescriptions?: Array<{
    items: Array<{ medicineName: string; dosage: string; frequency: string }>;
  }>;
}

interface MedicalRecordsState {
  records: MedicalRecordItem[];
  selectedRecord: MedicalRecordItem | null;
  isLoading: boolean;
  error: string | null;
  fetchRecords: () => Promise<void>;
  selectRecord: (id: string) => Promise<void>;
}

export const useMedicalRecordsStore = create<MedicalRecordsState>((set, get) => ({
  records: [],
  selectedRecord: null,
  isLoading: false,
  error: null,

  fetchRecords: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient('/medical-records');
      set({ records: res.data?.data || res.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  selectRecord: async (id: string) => {
    const cached = get().records.find((r) => r.id === id);
    if (cached) {
      set({ selectedRecord: cached });
      return;
    }
    set({ isLoading: true });
    try {
      const res = await mobileApiClient(`/medical-records/${id}`);
      set({ selectedRecord: res.data || res, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
