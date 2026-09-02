import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreatePrescriptionItemDto } from '../../prescriptions/dto/prescription.dto';
import { CreateDiagnosisDto } from '../../medical-records/dto/medical-record.dto';

export class CompleteConsultationDto {
  @IsString()
  @IsNotEmpty({ message: 'Appointment ID tidak boleh kosong' })
  appointmentId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Keluhan utama tidak boleh kosong' })
  chiefComplaint!: string;

  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsString()
  followUpNotes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDiagnosisDto)
  diagnoses?: CreateDiagnosisDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePrescriptionItemDto)
  prescriptionItems?: CreatePrescriptionItemDto[];
}
