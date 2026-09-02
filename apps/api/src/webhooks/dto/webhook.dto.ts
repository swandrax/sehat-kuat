import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentWebhookDto {
  @IsString()
  @IsNotEmpty()
  transactionRef!: string;

  @IsString()
  @IsNotEmpty()
  status!: 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  signature?: string;
}

export class AIJobWebhookDto {
  @IsString()
  @IsNotEmpty()
  jobId!: string;

  @IsString()
  @IsNotEmpty()
  status!: 'COMPLETED' | 'FAILED';

  @IsOptional()
  payload?: any;
}
