import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  userId!: string;

  @IsOptional()
  @IsString()
  clinicId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Spesialisasi tidak boleh kosong' })
  specialization!: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  clinicId?: string;

  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
