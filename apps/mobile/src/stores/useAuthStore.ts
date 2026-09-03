import { create } from 'zustand';
import { secureStorage } from '../utils/secureStorage';
import { mobileApiClient } from '../api/client';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const token = res.data?.access_token || res.access_token;
      const user = res.data?.user || res.user;

      if (token) {
        await secureStorage.setItem('access_token', token);
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (err: any) {
      set({
        error: err.message || 'Gagal masuk. Periksa email & kata sandi Anda.',
        isLoading: false,
      });
      return false;
    }
  },

  logout: async () => {
    await secureStorage.removeItem('access_token');
    set({ user: null, isAuthenticated: false });
  },

  checkSession: async () => {
    set({ isLoading: true });
    try {
      const token = await secureStorage.getItem('access_token');
      if (!token) {
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }
      const res = await mobileApiClient('/auth/me');
      set({
        user: res.data || res,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      await secureStorage.removeItem('access_token');
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  },
}));
