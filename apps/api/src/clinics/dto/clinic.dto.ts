import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClinicDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama klinik tidak boleh kosong' })
  name!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email klinik tidak valid' })
  email?: string;
}

export class UpdateClinicDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Format email klinik tidak valid' })
  email?: string;
}
