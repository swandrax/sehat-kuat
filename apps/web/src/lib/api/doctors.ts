import { apiClient } from './client';

export interface DoctorFilterParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const doctorsApi = {
  getAll: (params?: DoctorFilterParams) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/doctors${query ? `?${query}` : ''}`);
  },

  getProfile: () => apiClient('/doctors/profile'),

  getById: (id: string) => apiClient(`/doctors/${id}`),

  getSchedules: (doctorId: string) =>
    apiClient(`/doctors/${doctorId}/schedules`),

  createSchedule: (doctorId: string, data: any) =>
    apiClient(`/doctors/${doctorId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
