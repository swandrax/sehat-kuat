import { apiClient } from './client';

export const prescriptionsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/prescriptions${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient(`/prescriptions/${id}`),
};
