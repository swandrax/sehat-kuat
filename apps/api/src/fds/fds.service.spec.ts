import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FdsService } from './fds.service';

describe('FdsService (Fraud Detection System)', () => {
  let service: FdsService;
  let mockPrisma: any;
  let mockRedis: any;

  beforeEach(() => {
    mockPrisma = {
      claim: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
      claimDocument: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
      insurancePolicy: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'pol-1',
          network: ['Klinik Zavora Life', 'RS Citra Harapan'],
        }),
      },
      fdsRiskAssessment: {
        create: vi.fn(),
      },
    };

    mockRedis = {
      recordVelocity: vi.fn().mockResolvedValue({
        count: 1,
        totalAmount: 1500000,
        exceeded: false,
      }),
    };

    service = new FdsService(mockPrisma, mockRedis);
  });

  it('should grant low risk and AUTO_APPROVE for normal in-network claim', async () => {
    const result = await service.evaluateClaim({
      patientId: 'pat-1',
      policyId: 'pol-1',
      providerName: 'Klinik Zavora Life Pusat',
      claimAmount: 1500000,
      invoiceNumber: 'INV/2026/09/1122',
      treatmentDate: new Date(),
      diagnosisCode: 'E11.9',
    });

    expect(result.riskTier).toBe('LOW');
    expect(result.decision).toBe('AUTO_APPROVE');
    expect(result.riskScore).toBeLessThan(30);
    expect(result.reasonCodes).toContain('VELOCITY_NORMAL');
    expect(result.reasonCodes).toContain('IN_NETWORK_PROVIDER');
  });

  it('should flag DUPLICATE_INVOICE_NUMBER and escalate to MANUAL_REVIEW or REJECT', async () => {
    mockPrisma.claim.findFirst.mockResolvedValue({
      id: 'existing-claim-id',
      invoiceNumber: 'INV/2026/09/DUPLICATE-99',
    });

    const result = await service.evaluateClaim({
      patientId: 'pat-1',
      policyId: 'pol-1',
      providerName: 'Klinik Zavora Life',
      claimAmount: 2000000,
      invoiceNumber: 'INV/2026/09/DUPLICATE-99',
    });

    expect(result.reasonCodes).toContain('DUPLICATE_INVOICE_NUMBER');
    expect(result.riskScore).toBeGreaterThanOrEqual(50);
    expect(result.decision).not.toBe('AUTO_APPROVE');
  });

  it('should detect Redis velocity limit exceeded in sliding 24-hour window', async () => {
    mockRedis.recordVelocity.mockResolvedValue({
      count: 4,
      totalAmount: 55000000,
      exceeded: true,
    });

    const result = await service.evaluateClaim({
      patientId: 'pat-spam',
      policyId: 'pol-1',
      providerName: 'RS Citra Harapan',
      claimAmount: 20000000,
    });

    expect(result.reasonCodes).toContain('VELOCITY_EXCEEDED_24H');
    expect(result.factors.velocityScore).toBe(35);
  });
});
