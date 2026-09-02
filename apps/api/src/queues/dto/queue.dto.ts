import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { QueueStatus } from '@prisma/client';

export class CreateQueueDto {
  @IsString()
  @IsNotEmpty({ message: 'Doctor ID tidak boleh kosong' })
  doctorId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Patient ID tidak boleh kosong' })
  patientId!: string;

  @IsOptional()
  @IsString()
  clinicId?: string;

  @IsOptional()
  @IsString()
  appointmentId?: string;
}

export class UpdateQueueDto {
  @IsOptional()
  @IsEnum(QueueStatus, { message: 'Status antrean tidak valid' })
  status?: QueueStatus;
}
