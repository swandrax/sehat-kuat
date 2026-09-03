import { create } from 'zustand';
import { mobileApiClient } from '../api/client';

export interface Doctor {
  id: string;
  specialization: string;
  user: { name: string };
  clinic?: { name: string; address?: string };
}

export interface QueueTicket {
  id: string;
  queueNumber: number;
  status: 'WAITING' | 'CALLED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED';
  currentServingNumber?: number;
  estimatedWaitMinutes?: number;
  doctor?: { user?: { name: string } };
  clinic?: { name: string };
  date: string;
}

interface AppointmentsQueueState {
  doctors: Doctor[];
  activeQueue: QueueTicket | null;
  historyQueues: QueueTicket[];
  isLoading: boolean;
  error: string | null;
  fetchDoctors: () => Promise<void>;
  fetchActiveQueue: () => Promise<void>;
  bookAppointmentAndQueue: (doctorId: string, clinicId?: string, notes?: string) => Promise<boolean>;
}

export const useAppointmentsQueueStore = create<AppointmentsQueueState>((set) => ({
  doctors: [],
  activeQueue: null,
  historyQueues: [],
  isLoading: false,
  error: null,

  fetchDoctors: async () => {
    set({ isLoading: true });
    try {
      const res = await mobileApiClient('/doctors');
      set({ doctors: res.data || res, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchActiveQueue: async () => {
    try {
      const res = await mobileApiClient('/queues');
      const list: QueueTicket[] = res.data?.data || res.data || [];
      const active = list.find((q) => q.status === 'WAITING' || q.status === 'CALLED' || q.status === 'IN_SERVICE');
      set({
        activeQueue: active || null,
        historyQueues: list,
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  bookAppointmentAndQueue: async (doctorId, clinicId, notes) => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient('/queues', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          clinicId,
          notes,
        }),
      });
      set({ activeQueue: res.data || res, isLoading: false });
      return true;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      return false;
    }
  },
}));
