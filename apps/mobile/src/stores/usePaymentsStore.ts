import { create } from 'zustand';
import { mobileApiClient } from '../api/client';

export interface PaymentItem {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
}

interface PaymentsState {
  payments: PaymentItem[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  createPayment: (amount: number, method: string) => Promise<boolean>;
}

export const usePaymentsStore = create<PaymentsState>((set) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchPayments: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient('/payments');
      set({ payments: res.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  createPayment: async (amount, method) => {
    set({ isLoading: true });
    try {
      await mobileApiClient('/payments', {
        method: 'POST',
        body: JSON.stringify({ amount, paymentMethod: method }),
      });
      set({ isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
