import { apiClient } from './client';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: 'PATIENT' | 'DOCTOR' | 'STAFF' | 'ADMIN';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: LoginPayload) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () =>
    apiClient('/auth/logout', {
      method: 'POST',
    }),

  getMe: () => apiClient('/auth/me'),
};
