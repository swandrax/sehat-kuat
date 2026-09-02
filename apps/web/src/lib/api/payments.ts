import { apiClient } from './client';

export const paymentsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/payments${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient(`/payments/${id}`),

  create: (data: { patientId: string; appointmentId?: string; amount: number; paymentMethod?: string }) =>
    apiClient('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
