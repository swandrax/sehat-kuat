import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty({ message: 'Patient ID tidak boleh kosong' })
  patientId!: string;

  @IsOptional()
  @IsString()
  appointmentId?: string;

  @IsNumber({}, { message: 'Nominal pembayaran harus angka' })
  @Min(1000, { message: 'Nominal minimal Rp 1.000' })
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string = 'IDR';

  @IsOptional()
  @IsString()
  paymentMethod?: string; // QRIS, VIRTUAL_ACCOUNT
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Status pembayaran tidak valid' })
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionRef?: string;
}
