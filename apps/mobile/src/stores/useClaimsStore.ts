import { create } from 'zustand';
import { mobileApiClient } from '../api/client';

export interface ClaimItem {
  id: string;
  claimNumber: string;
  providerName: string;
  diagnosisCode?: string;
  diagnosisDescription?: string;
  invoiceNumber?: string;
  invoiceAmount: number;
  claimAmount: number;
  coveredAmount: number;
  patientPayableAmount: number;
  status: 'SUBMITTED' | 'OCR_PROCESSING' | 'NLP_EXTRACTED' | 'FDS_REVIEW' | 'AUTO_APPROVED' | 'MANUAL_REVIEW' | 'REJECTED' | 'PAID';
  preAuthCode?: string;
  autraConfidenceScore?: number;
  fdsRiskScore?: number;
  createdAt: string;
  treatmentDate: string;
  policy?: { provider: string; policyCode: string };
  documents?: Array<{ fileName: string; documentType: string; fileUrl: string }>;
  riskAssessments?: Array<{ riskScore: number; decision: string; reasonCodes: string[] }>;
}

export interface OcrExtractedData {
  documentType: string;
  detectedInvoiceNumber?: string;
  detectedProvider?: string;
  detectedDiagnosisCode?: string;
  detectedDiagnosisName?: string;
  detectedAmount?: number;
  detectedDate?: string;
  rawText?: string;
  detectedMedications: Array<{ name: string; dosage?: string; qty?: number }>;
  extractedEntities: Array<{ key: string; value: string; snippet: string; confidence: number }>;
}

interface ClaimsState {
  claims: ClaimItem[];
  selectedClaim: ClaimItem | null;
  ocrExtracted: OcrExtractedData | null;
  isAnalyzingOcr: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;
  fetchClaims: () => Promise<void>;
  getClaimDetail: (id: string) => Promise<void>;
  analyzeDocumentWithAutra: (fileName: string, rawText?: string) => Promise<OcrExtractedData | null>;
  submitClaim: (payload: {
    policyCode: string;
    providerName: string;
    claimAmount: number;
    invoiceNumber?: string;
    diagnosisCode?: string;
    documents?: Array<{ fileName: string; fileUrl: string; documentType?: string; ocrRawText?: string }>;
    notes?: string;
  }) => Promise<{ success: boolean; claim?: ClaimItem; message?: string }>;
}

export const useClaimsStore = create<ClaimsState>((set, get) => ({
  claims: [],
  selectedClaim: null,
  ocrExtracted: null,
  isAnalyzingOcr: false,
  isSubmitting: false,
  isLoading: false,
  error: null,

  fetchClaims: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await mobileApiClient('/insurance/claims');
      set({ claims: res.data || [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  getClaimDetail: async (id: string) => {
    set({ isLoading: true });
    try {
      const res = await mobileApiClient(`/insurance/claims/${id}`);
      set({ selectedClaim: res.data || res, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  analyzeDocumentWithAutra: async (fileName, rawText) => {
    set({ isAnalyzingOcr: true, error: null });
    try {
      const res = await mobileApiClient('/autra/analyze-document', {
        method: 'POST',
        body: JSON.stringify({ fileName, rawText }),
      });
      const data: OcrExtractedData = res.data;
      set({ ocrExtracted: data, isAnalyzingOcr: false });
      return data;
    } catch (err: any) {
      set({ error: err.message, isAnalyzingOcr: false });
      return null;
    }
  },

  submitClaim: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const res = await mobileApiClient('/insurance/claims', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      await get().fetchClaims();
      set({ isSubmitting: false });
      return {
        success: true,
        claim: res.data?.claim || res.data,
        message: res.message,
      };
    } catch (err: any) {
      set({ isSubmitting: false, error: err.message });
      return {
        success: false,
        message: err.message,
      };
    }
  },
}));
