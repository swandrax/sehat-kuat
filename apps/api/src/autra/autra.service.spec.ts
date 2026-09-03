import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AutraService } from './autra.service';

describe('AutraService (Insurance Intelligence & Claims Processing)', () => {
  let service: AutraService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      insurancePolicy: {
        findFirst: vi.fn(),
      },
    };
    service = new AutraService(mockPrisma);
  });

  it('should parse unstructured invoice document into structured ICD-10 and amount', async () => {
    const rawInvoice = `
      RUMAH SAKIT CITRA HARAPAN
      No. Invoice: INV/2026/09/8891
      Nama Pasien: Budi Santoso
      Diagnosa: E11.9 Diabetes Melitus Tipe 2
      Tindakan: 99213 Konsultasi
      Total: Rp 1.850.000
    `;

    const result = await service.processClaimDocument('citra_harapan_invoice.pdf', rawInvoice);

    expect(result.documentType).toBe('MEDICAL_INVOICE');
    expect(result.detectedInvoiceNumber).toBe('INV/2026/09/8891');
    expect(result.detectedDiagnosisCode).toBe('E11.9');
    expect(result.detectedAmount).toBe(1850000);
    expect(result.detectedProvider).toBe('RS Citra Harapan');
    expect(result.extractedEntities.length).toBeGreaterThanOrEqual(4);
  });

  it('should classify pharmacy receipts and extract prescribed medications', async () => {
    const rawReceipt = `
      APOTEK MITRA K-24 REKANAN
      R/ Metformin 500mg (3x1 tab)
      R/ Glimepiride 2mg
      TOTAL PEMBAYARAN: Rp 400.000
    `;

    const result = await service.processClaimDocument('resep_apotek.pdf', rawReceipt);

    expect(result.documentType).toBe('PHARMACY_RECEIPT');
    expect(result.detectedMedications.length).toBeGreaterThan(0);
    expect(result.detectedAmount).toBe(400000);
  });

  it('should auto-approve cashless pre-auth when claim is within remaining policy limit', async () => {
    mockPrisma.insurancePolicy.findFirst.mockResolvedValue({
      id: 'pol-1',
      policyCode: 'ZVR-CORP-88912-ID',
      provider: 'Zavora Life Protection Corporate',
      status: 'ACTIVE',
      remainingLimit: 200000000,
      outpatientCoveragePct: 100,
    });

    const evaluation = await service.evaluatePolicyCoverage('ZVR-CORP-88912-ID', 1500000, 'E11.9');

    expect(evaluation.status).toBe('AUTO_APPROVED');
    expect(evaluation.coveredAmount).toBe(1500000);
    expect(evaluation.patientPayable).toBe(0);
    expect(evaluation.preAuthCode).toBeDefined();
    expect(evaluation.preAuthCode).toContain('AUTRA-PREAUTH-');
  });

  it('should partially cover claim when it exceeds remaining policy balance', async () => {
    mockPrisma.insurancePolicy.findFirst.mockResolvedValue({
      id: 'pol-2',
      policyCode: 'ADM-HLTH-99412-JKT',
      provider: 'Admedika Healthcare',
      status: 'ACTIVE',
      remainingLimit: 1000000, // Only 1M left
      outpatientCoveragePct: 100,
    });

    const evaluation = await service.evaluatePolicyCoverage('ADM-HLTH-99412-JKT', 2500000, 'I10');

    expect(evaluation.status).toBe('PARTIAL_COVERAGE');
    expect(evaluation.coveredAmount).toBe(1000000);
    expect(evaluation.patientPayable).toBe(1500000);
  });
});
