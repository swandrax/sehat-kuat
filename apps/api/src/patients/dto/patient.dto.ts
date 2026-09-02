import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  userId!: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal lahir tidak valid (YYYY-MM-DD)' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  bloodType?: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal lahir tidak valid (YYYY-MM-DD)' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;

  @IsOptional()
  @IsString()
  bloodType?: string;
}
