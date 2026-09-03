import { create } from 'zustand';

interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  language: 'id' | 'en';
  biometricLoginEnabled: boolean;
  maskPiiOnScreen: boolean;
  offlineCacheEnabled: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'id' | 'en') => void;
  toggleBiometric: () => void;
  toggleMaskPii: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  theme: 'light',
  language: 'id',
  biometricLoginEnabled: true,
  maskPiiOnScreen: true,
  offlineCacheEnabled: true,

  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  toggleBiometric: () =>
    set((state) => ({ biometricLoginEnabled: !state.biometricLoginEnabled })),
  toggleMaskPii: () =>
    set((state) => ({ maskPiiOnScreen: !state.maskPiiOnScreen })),
}));
