import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class ConnectInsuranceDto {
  @IsString()
  @IsNotEmpty()
  provider!: string;

  @IsString()
  @IsNotEmpty()
  policyCode!: string;

  @IsString()
  @IsNotEmpty()
  holderName!: string;

  @IsOptional()
  @IsString()
  cardNumber?: string;
}

export class EvaluateClaimDto {
  @IsString()
  @IsNotEmpty()
  policyCode!: string;

  @IsString()
  @IsNotEmpty()
  diagnosisCode!: string; // ICD-10 code (e.g. E11.9, I20.9)

  @IsNumber()
  claimAmount!: number;

  @IsOptional()
  @IsString()
  facilityName?: string;

  @IsOptional()
  @IsString()
  treatmentType?: string; // INPATIENT | OUTPATIENT | PHARMACY | LAB
}

export class ClaimDocumentUploadItemDto {
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @IsOptional()
  @IsString()
  documentType?: string;

  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @IsOptional()
  @IsString()
  checksumSha256?: string;

  @IsOptional()
  @IsString()
  ocrRawText?: string;
}

export class SubmitClaimDto {
  @IsString()
  @IsNotEmpty()
  policyCode!: string;

  @IsString()
  @IsNotEmpty()
  providerName!: string;

  @IsNumber()
  claimAmount!: number;

  @IsOptional()
  @IsNumber()
  invoiceAmount?: number;

  @IsOptional()
  @IsString()
  invoiceNumber?: string;

  @IsOptional()
  @IsString()
  diagnosisCode?: string;

  @IsOptional()
  @IsString()
  diagnosisDescription?: string;

  @IsOptional()
  @IsString()
  treatmentDate?: string;

  @IsOptional()
  documents?: ClaimDocumentUploadItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}

export class AdjudicateClaimDto {
  @IsString()
  @IsNotEmpty()
  decision!: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsNumber()
  approvedAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}

