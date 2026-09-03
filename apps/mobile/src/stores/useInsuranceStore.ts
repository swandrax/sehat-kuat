import { create } from 'zustand';
import { mobileApiClient } from '../api/client';

export interface PolicyCard {
  id: string;
  provider: string;
  policyCode: string;
  holderName: string;
  cardNumber: string;
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'EXPIRED';
  isCashless: boolean;
  annualLimit: number;
  remainingLimit: number;
  inpatientRoomLimitPerDay: number;
  outpatientCoveragePct: number;
  validUntil: string;
  network: string[];
}

interface InsuranceState {
  policies: PolicyCard[];
  selectedPolicy: PolicyCard | null;
  isLoading: boolean;
  error: string | null;
  fetchPolicies: () => Promise<void>;
  selectPolicy: (code: string) => void;
  connectPolicy: (data: { provider: string; policyCode: string; holderName: string }) => Promise<boolean>;
}

export const useInsuranceStore = create<InsuranceState>((set, get) => ({
  policies: [],
  selectedPolicy: null,
  isLoading: false,
  error: null,

  fetchPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient('/insurance/policies');
      const list: PolicyCard[] = res.data || [];
      set({
        policies: list,
        selectedPolicy: get().selectedPolicy || list[0] || null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  selectPolicy: (code: string) => {
    const policy = get().policies.find((p) => p.policyCode === code);
    if (policy) {
      set({ selectedPolicy: policy });
    }
  },

  connectPolicy: async (data) => {
    set({ isLoading: true });
    try {
      const res = await mobileApiClient('/insurance/connect', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      await get().fetchPolicies();
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
