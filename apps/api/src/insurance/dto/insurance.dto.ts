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
