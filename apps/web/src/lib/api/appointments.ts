import { apiClient } from './client';

export interface CreateAppointmentPayload {
  patientId: string;
  doctorId: string;
  clinicId?: string;
  scheduleId?: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export const appointmentsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/appointments${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient(`/appointments/${id}`),

  create: (data: CreateAppointmentPayload) =>
    apiClient('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiClient(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
