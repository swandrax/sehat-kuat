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

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  clinicId?: string;
  scheduleId?: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes?: string;
  doctor?: {
    id: string;
    specialization: string;
    user?: { name: string; email?: string; phone?: string };
    clinic?: { name: string; address?: string };
  };
  patient?: {
    id: string;
    gender?: string;
    bloodType?: string;
    emergencyContact?: string;
    address?: string;
    user?: { name: string; email?: string; phone?: string };
  };
  queue?: {
    queueNumber: number;
    status: string;
  };
}

export const appointmentsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient<Appointment[]>(`/appointments${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient<Appointment>(`/appointments/${id}`),

  create: (data: CreateAppointmentPayload) =>
    apiClient<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateAppointmentPayload & { status: string }>) =>
    apiClient<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    apiClient<Appointment>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
