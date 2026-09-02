import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { RoleType } from '@prisma/client';

export class RegisterDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(RoleType, { message: 'Role harus PATIENT, DOCTOR, STAFF, atau ADMIN' })
  role!: RoleType;
}

export class LoginDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  password!: string;
}
