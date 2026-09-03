import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { FdsDecision } from '@prisma/client';

export interface FdsEvaluationInput {
  patientId: string;
  policyId: string;
  providerName: string;
  claimAmount: number;
  invoiceNumber?: string;
  treatmentDate?: Date;
  diagnosisCode?: string;
  documentChecksums?: string[];
  ipAddress?: string;
}

export interface FdsEvaluationResult {
  riskScore: number; // 0 - 100
  decision: FdsDecision;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  reasonCodes: string[];
  factors: {
    velocityScore: number;
    duplicateScore: number;
    clinicalSurgeScore: number;
    networkScore: number;
    temporalScore: number;
  };
  velocitySummary: {
    claimsInLast24h: number;
    totalAmountLast24h: number;
    velocityExceeded: boolean;
  };
  recommendation: string;
}

@Injectable()
export class FdsService {
  private readonly logger = new Logger(FdsService.name);

  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  /**
   * Evaluates claim against high-speed Redis velocity counters, duplicate document & invoice detection,
   * and rule-based anomaly scoring.
   */
  async evaluateClaim(input: FdsEvaluationInput): Promise<FdsEvaluationResult> {
    const reasonCodes: string[] = [];
    let riskScore = 0;

    // 1. High-speed Redis Velocity Check (Sliding 24h window)
    const patientVelocityKey = `patient:${input.patientId}:24h`;
    const velocity = await this.redis.recordVelocity(
      patientVelocityKey,
      86400, // 24 hours
      input.claimAmount,
      3, // Max 3 claims in 24 hours
      50000000, // Max 50M IDR per 24 hours
    );

    let velocityScore = 0;
    if (velocity.exceeded) {
      velocityScore = 35;
      riskScore += 35;
      reasonCodes.push('VELOCITY_EXCEEDED_24H');
      this.logger.warn(`FDS Velocity Alert: Patient ${input.patientId} exceeded 24h frequency/amount limit.`);
    } else if (velocity.count > 1) {
      velocityScore = 10;
      riskScore += 10;
      reasonCodes.push('VELOCITY_MULTIPLE_SAME_DAY');
    } else {
      reasonCodes.push('VELOCITY_NORMAL');
    }

    // 2. Duplicate Invoice Detection
    let duplicateScore = 0;
    if (input.invoiceNumber) {
      const existingInvoice = await this.prisma.claim.findFirst({
        where: {
          invoiceNumber: input.invoiceNumber,
          status: { in: ['AUTO_APPROVED', 'MANUAL_REVIEW', 'PAID'] },
        },
      });

      if (existingInvoice) {
        duplicateScore += 50;
        riskScore += 50;
        reasonCodes.push('DUPLICATE_INVOICE_NUMBER');
      }
    }

    // 3. Duplicate Document File Checksum Detection (SHA-256)
    if (input.documentChecksums && input.documentChecksums.length > 0) {
      const duplicateDocs = await this.prisma.claimDocument.findFirst({
        where: {
          checksumSha256: { in: input.documentChecksums },
        },
        include: { claim: true },
      });

      if (duplicateDocs) {
        duplicateScore += 45;
        riskScore += 45;
        reasonCodes.push('DUPLICATE_DOCUMENT_CHECKSUM');
      }
    }

    if (duplicateScore === 0) {
      reasonCodes.push('DOCUMENTS_AUTHENTIC');
    }

    // 4. Clinical Diagnosis & Amount Surge Anomaly
    let clinicalSurgeScore = 0;
    if (input.diagnosisCode) {
      const code = input.diagnosisCode.toUpperCase();
      // Minor conditions (e.g. J00-J06 upper respiratory, K29 gastritis) claiming excessive amounts
      if ((code.startsWith('J00') || code.startsWith('J02') || code.startsWith('K29')) && input.claimAmount > 5000000) {
        clinicalSurgeScore = 25;
        riskScore += 25;
        reasonCodes.push('UNUSUAL_DIAGNOSIS_COST_RATIO');
      }
    }

    // 5. Network & Provider Validation
    let networkScore = 0;
    const policy = await this.prisma.insurancePolicy.findUnique({
      where: { id: input.policyId },
    });

    if (policy && policy.network && policy.network.length > 0) {
      const isNetworkMatch = policy.network.some((n) =>
        input.providerName.toLowerCase().includes(n.toLowerCase()),
      );
      if (!isNetworkMatch) {
        networkScore = 15;
        riskScore += 15;
        reasonCodes.push('OUT_OF_NETWORK_PROVIDER');
      } else {
        reasonCodes.push('IN_NETWORK_PROVIDER');
      }
    }

    // 6. Temporal Anomaly (Treatment date in future or older than 60 days)
    let temporalScore = 0;
    if (input.treatmentDate) {
      const now = Date.now();
      const treatTime = new Date(input.treatmentDate).getTime();
      const diffDays = (now - treatTime) / (1000 * 60 * 60 * 24);

      if (diffDays < -0.1) {
        temporalScore = 30;
        riskScore += 30;
        reasonCodes.push('FUTURE_TREATMENT_DATE');
      } else if (diffDays > 60) {
        temporalScore = 15;
        riskScore += 15;
        reasonCodes.push('STALE_CLAIM_TIMEFRAME');
      }
    }

    // Clamp score to 100
    riskScore = Math.min(100, Math.max(0, riskScore));

    // Decision matrix
    let decision: FdsDecision;
    let riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
    let recommendation: string;

    if (riskScore < 30) {
      decision = FdsDecision.AUTO_APPROVE;
      riskTier = 'LOW';
      recommendation = 'Lolos audit anomali & verifikasi keaslian dokumen. Siap diproses instan via Autra-AI.';
    } else if (riskScore < 70) {
      decision = FdsDecision.MANUAL_REVIEW;
      riskTier = 'MEDIUM';
      recommendation = 'Indikasi risiko terdeteksi. Dialihkan ke antrean Claims Officer untuk verifikasi manual.';
    } else {
      decision = FdsDecision.REJECT;
      riskTier = 'HIGH';
      recommendation = 'Klaim ditolak otomatis oleh Fraud Detection System karena anomali duplikasi atau ambang batas kritis.';
    }

    return {
      riskScore,
      decision,
      riskTier,
      reasonCodes,
      factors: {
        velocityScore,
        duplicateScore,
        clinicalSurgeScore,
        networkScore,
        temporalScore,
      },
      velocitySummary: {
        claimsInLast24h: velocity.count,
        totalAmountLast24h: velocity.totalAmount,
        velocityExceeded: velocity.exceeded,
      },
      recommendation,
    };
  }

  /**
   * Persists an FDS evaluation record for transparency and auditing
   */
  async recordAssessment(claimId: string, evaluation: FdsEvaluationResult) {
    return this.prisma.fdsRiskAssessment.create({
      data: {
        claimId,
        riskScore: evaluation.riskScore,
        decision: evaluation.decision,
        reasonCodes: evaluation.reasonCodes,
        factors: evaluation.factors,
        velocitySummary: evaluation.velocitySummary,
      },
    });
  }
}
