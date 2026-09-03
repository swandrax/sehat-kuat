import { apiClient } from './client';

export interface SubmitClaimPayload {
  policyCode: string;
  providerName: string;
  claimAmount: number;
  invoiceNumber?: string;
  diagnosisCode?: string;
  diagnosisDescription?: string;
  treatmentDate?: string;
  notes?: string;
  documents?: Array<{
    fileName: string;
    fileUrl: string;
    documentType?: string;
    ocrRawText?: string;
    checksumSha256?: string;
  }>;
}

export const insuranceApi = {
  getAllPolicies: () => apiClient('/insurance/policies'),

  getPolicyByCode: (code: string) => apiClient(`/insurance/policies/${code}`),

  connectPolicy: (data: { provider: string; policyCode: string; holderName: string; cardNumber?: string }) =>
    apiClient('/insurance/connect', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  evaluateClaimWithAutraAI: (data: { policyCode: string; diagnosisCode: string; claimAmount: number }) =>
    apiClient('/insurance/evaluate-claim', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  analyzeDocumentOCR: (data: { fileName: string; rawText?: string }) =>
    apiClient('/autra/analyze-document', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitClaim: (data: SubmitClaimPayload) =>
    apiClient('/insurance/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getClaims: (status?: string) =>
    apiClient(`/insurance/claims${status ? `?status=${status}` : ''}`),

  getClaimById: (id: string) => apiClient(`/insurance/claims/${id}`),

  adjudicateClaim: (id: string, data: { decision: 'APPROVE' | 'REJECT'; approvedAmount?: number; notes?: string }) =>
    apiClient(`/insurance/claims/${id}/adjudicate`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  getClaimPdfData: (id: string) => apiClient(`/insurance/claims/${id}/pdf-export`),
};
