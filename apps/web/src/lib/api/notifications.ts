import { apiClient } from './client';

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/notifications${query ? `?${query}` : ''}`);
  },

  markAllAsRead: () =>
    apiClient('/notifications/read-all', {
      method: 'PATCH',
    }),

  markAsRead: (id: string) =>
    apiClient(`/notifications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isRead: true }),
    }),
};
