import { apiClient } from './client';

export const medicalRecordsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/medical-records${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient(`/medical-records/${id}`),

  create: (data: any) =>
    apiClient('/medical-records', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
