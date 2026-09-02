import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID tidak boleh kosong' })
  userId!: string;

  @IsString()
  @IsNotEmpty({ message: 'Judul notifikasi tidak boleh kosong' })
  title!: string;

  @IsString()
  @IsNotEmpty({ message: 'Pesan notifikasi tidak boleh kosong' })
  message!: string;

  @IsOptional()
  @IsEnum(NotificationType, { message: 'Tipe notifikasi tidak valid' })
  type?: NotificationType;
}

export class UpdateNotificationDto {
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
