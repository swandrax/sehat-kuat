import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePrescriptionItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama obat tidak boleh kosong' })
  medicineName!: string;

  @IsString()
  @IsNotEmpty({ message: 'Dosis obat tidak boleh kosong' })
  dosage!: string; // "500mg"

  @IsString()
  @IsNotEmpty({ message: 'Frekuensi tidak boleh kosong' })
  frequency!: string; // "3x sehari"

  @IsString()
  @IsNotEmpty({ message: 'Durasi tidak boleh kosong' })
  duration!: string; // "5 hari"

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number = 1;
}

export class CreatePrescriptionDto {
  @IsString()
  @IsNotEmpty({ message: 'Patient ID tidak boleh kosong' })
  patientId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Doctor ID tidak boleh kosong' })
  doctorId!: string;

  @IsOptional()
  @IsString()
  medicalRecordId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  items!: CreatePrescriptionItemDto[];
}

export class UpdatePrescriptionDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  status?: string; // ACTIVE, DISPENSED, CANCELLED
}
