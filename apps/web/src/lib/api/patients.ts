import { apiClient } from './client';

export interface PatientProfileData {
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: string;
}

export const patientsApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return apiClient(`/patients${query ? `?${query}` : ''}`);
  },

  getProfile: () => apiClient('/patients/profile'),

  getById: (id: string) => apiClient(`/patients/${id}`),

  update: (id: string, data: PatientProfileData) =>
    apiClient(`/patients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
