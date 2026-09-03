import { create } from 'zustand';
import { mobileApiClient } from '../api/client';

export interface PatientProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bloodType?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  nik?: string;
}

interface ProfileState {
  profile: PatientProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<PatientProfile>) => Promise<boolean>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient('/patients/me');
      set({ profile: res.data || res, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true });
    try {
      const res = await mobileApiClient('/patients/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      set({ profile: res.data || res, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
