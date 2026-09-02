import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString()
  @IsNotEmpty({ message: 'Patient ID tidak boleh kosong' })
  patientId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Doctor ID tidak boleh kosong' })
  doctorId!: string;

  @IsOptional()
  @IsString()
  clinicId?: string;

  @IsOptional()
  @IsString()
  scheduleId?: string;

  @IsDateString({}, { message: 'Format tanggal janji temu tidak valid (YYYY-MM-DD)' })
  appointmentDate!: string;

  @IsString()
  @IsNotEmpty({ message: 'Jam janji temu tidak boleh kosong (e.g. 09:30)' })
  appointmentTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsEnum(AppointmentStatus, { message: 'Status janji temu tidak valid' })
  status?: AppointmentStatus;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal janji temu tidak valid' })
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  appointmentTime?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
