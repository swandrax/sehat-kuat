import { apiClient } from './client';

export const clinicsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/clinics${query ? `?${query}` : ''}`);
  },
  getById: (id: string) => apiClient(`/clinics/${id}`),
};
