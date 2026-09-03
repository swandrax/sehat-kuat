import { apiClient } from './client';

export interface RegionItem {
  id: string;
  name: string;
  parentId?: string;
}

export interface HealthWorkerStat {
  province: string;
  medicalWorkers: string;
  midwives: string;
  pharmacists: string;
  total: string;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  distanceKm?: number;
  estimatedMinutes?: number;
  operatingHours: string;
  isOpenNow: boolean;
  is24Hours: boolean;
  hasEmergency: boolean;
  phone: string;
  services: string[];
}

export const facilitiesApi = {
  getAll: (params?: Record<string, string | number | boolean | undefined>) => {
    const cleanParams: Record<string, string> = {};
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined) cleanParams[k] = String(v);
      });
    }
    const query = new URLSearchParams(cleanParams).toString();
    return apiClient<HealthcareFacility[]>(`/facilities${query ? `?${query}` : ''}`);
  },

  getById: (id: string) => apiClient<HealthcareFacility>(`/facilities/${id}`),

  getProvinces: () => apiClient<RegionItem[]>('/facilities/regions/provinces'),

  getRegencies: (provinceId?: string) =>
    apiClient<RegionItem[]>(`/facilities/regions/regencies${provinceId ? `?provinceId=${provinceId}` : ''}`),

  getDistricts: (regencyId?: string) =>
    apiClient<RegionItem[]>(`/facilities/regions/districts${regencyId ? `?regencyId=${regencyId}` : ''}`),

  getHealthWorkerStats: () => apiClient<HealthWorkerStat[]>('/facilities/stats/health-workers'),
};
