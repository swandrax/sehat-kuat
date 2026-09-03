import { create } from 'zustand';

export type FacilityType =
  | 'ALL'
  | 'CLINIC'
  | 'HOSPITAL'
  | 'PHARMACY'
  | 'LABORATORY'
  | 'PUSKESMAS'
  | 'EMERGENCY'
  | 'OTHER';

export type RouteAlgorithm = 'A_STAR' | 'DIJKSTRA';

export interface HealthcareFacility {
  id: string;
  name: string;
  type: FacilityType;
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

interface FacilitiesState {
  searchQuery: string;
  selectedType: FacilityType;
  maxDistance: number;
  selectedServices: string[];
  openStatus: 'ALL' | 'OPEN_NOW' | 'EMERGENCY_24H';
  minRating: number;
  sortBy: 'DISTANCE' | 'RATING' | 'NAME';
  routeAlgorithm: RouteAlgorithm;
  selectedFacilityId: string | null;
  facilityDetailsModal: HealthcareFacility | null;
  isFilterDrawerOpen: boolean;
  activeTab: 'filter' | 'preferensi';
  userLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: FacilityType) => void;
  setMaxDistance: (distance: number) => void;
  toggleService: (service: string) => void;
  setOpenStatus: (status: 'ALL' | 'OPEN_NOW' | 'EMERGENCY_24H') => void;
  setMinRating: (rating: number) => void;
  setSortBy: (sort: 'DISTANCE' | 'RATING' | 'NAME') => void;
  setRouteAlgorithm: (algorithm: RouteAlgorithm) => void;
  setSelectedFacilityId: (id: string | null) => void;
  setFacilityDetailsModal: (facility: HealthcareFacility | null) => void;
  setIsFilterDrawerOpen: (open: boolean) => void;
  setActiveTab: (tab: 'filter' | 'preferensi') => void;
  setUserLocation: (loc: { latitude: number; longitude: number; address: string }) => void;
  resetFilters: () => void;
}

export const useFacilitiesStore = create<FacilitiesState>((set) => ({
  searchQuery: '',
  selectedType: 'ALL',
  maxDistance: 10,
  selectedServices: [],
  openStatus: 'ALL',
  minRating: 0,
  sortBy: 'DISTANCE',
  routeAlgorithm: 'A_STAR',
  selectedFacilityId: 'fac-1', // Default selected: Klinik Sehat Pejuang
  facilityDetailsModal: null,
  isFilterDrawerOpen: false,
  activeTab: 'filter',
  userLocation: {
    latitude: -6.1990,
    longitude: 106.9870,
    address: 'Jalan Kalibabang, Pejuang Bekasi, Jawa Barat',
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedType: (type) => set({ selectedType: type }),
  setMaxDistance: (distance) => set({ maxDistance: distance }),
  toggleService: (service) =>
    set((state) => {
      const exists = state.selectedServices.includes(service);
      return {
        selectedServices: exists
          ? state.selectedServices.filter((s) => s !== service)
          : [...state.selectedServices, service],
      };
    }),
  setOpenStatus: (status) => set({ openStatus: status }),
  setMinRating: (rating) => set({ minRating: rating }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setRouteAlgorithm: (algorithm) => set({ routeAlgorithm: algorithm }),
  setSelectedFacilityId: (id) => set({ selectedFacilityId: id }),
  setFacilityDetailsModal: (facility) => set({ facilityDetailsModal: facility }),
  setIsFilterDrawerOpen: (open) => set({ isFilterDrawerOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setUserLocation: (loc) => set({ userLocation: loc }),
  resetFilters: () =>
    set({
      selectedType: 'ALL',
      maxDistance: 10,
      selectedServices: [],
      openStatus: 'ALL',
      minRating: 0,
      searchQuery: '',
      sortBy: 'DISTANCE',
    }),
}));
