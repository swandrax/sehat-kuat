import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateDiagnosisDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama diagnosis tidak boleh kosong' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateMedicalRecordDto {
  @IsString()
  @IsNotEmpty({ message: 'Patient ID tidak boleh kosong' })
  patientId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Doctor ID tidak boleh kosong' })
  doctorId!: string;

  @IsOptional()
  @IsString()
  appointmentId?: string;

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
}

export class UpdateMedicalRecordDto {
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @IsOptional()
  @IsString()
  clinicalNotes?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsString()
  followUpNotes?: string;
}
