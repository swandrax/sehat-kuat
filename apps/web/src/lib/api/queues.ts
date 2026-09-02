import { apiClient } from './client';

export const queuesApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/queues${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient(`/queues/${id}`),

  updateStatus: (id: string, status: string) =>
    apiClient(`/queues/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
