import { apiClient } from './client';

export interface SymptomClassificationResult {
  specialty: string;
  confidence: number;
  model: string;
  top_predictions?: Array<{ specialty: string; confidence: number }>;
}

export interface HealthRiskResult {
  age: number;
  systolic: number;
  diastolic: number;
  condition: string;
  risk_score: number;
  status: string;
  recommended_action: string;
}

export interface DiseaseKnowledge {
  name: string;
  description: string;
  causes: string;
  symptoms: string;
}

export interface MedicineKnowledge {
  name: string;
  description: string;
  warnings: string;
  dosage: string;
  sideEffects: string;
  diseases: string;
}

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

  // ML & Deep Learning Endpoints
  classifySymptom: (symptoms: string) =>
    apiClient<SymptomClassificationResult>('/ml/classify-symptom', {
      method: 'POST',
      body: JSON.stringify({ symptoms }),
    }),

  predictHealthRisk: (data: {
    age: number;
    systolic: number;
    diastolic: number;
    condition?: string;
  }) =>
    apiClient<HealthRiskResult>('/ml/predict-risk', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMetrics: () => apiClient('/ml/metrics'),

  triggerTraining: () =>
    apiClient('/ml/train', {
      method: 'POST',
    }),

  // RAG Knowledge Search
  searchDiseases: (q?: string, limit = 10) =>
    apiClient<DiseaseKnowledge[]>(`/ai/knowledge/diseases?q=${encodeURIComponent(q || '')}&limit=${limit}`),

  searchMedicines: (q?: string, limit = 10) =>
    apiClient<MedicineKnowledge[]>(`/ai/knowledge/medicines?q=${encodeURIComponent(q || '')}&limit=${limit}`),

  getRAGContext: (prompt: string) =>
    apiClient<{ prompt: string; context: string }>(`/ai/knowledge/rag?prompt=${encodeURIComponent(prompt)}`),
};
