import { apiClient } from './client';

export const aiApi = {
  getSessions: () => apiClient('/chat/sessions'),

  getSession: (id: string) => apiClient(`/chat/sessions/${id}`),

  createSession: (title?: string) =>
    apiClient('/chat/sessions', {
      method: 'POST',
      body: JSON.stringify({ title }),
    }),

  sendMessage: (sessionId: string, content: string) =>
    apiClient(`/chat/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ role: 'user', content }),
    }),
};
