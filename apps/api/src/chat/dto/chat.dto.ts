import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  recipientId?: string;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  persona?: string;

  @IsOptional()
  @IsString()
  customInstructions?: string;
}

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Role tidak boleh kosong' })
  role!: string; // user, assistant, doctor, patient

  @IsString()
  @IsNotEmpty({ message: 'Pesan tidak boleh kosong' })
  content!: string;

  @IsOptional()
  @IsString()
  recipientId?: string;

  @IsOptional()
  @IsString()
  persona?: string;
}

export class GenerateCoPilotDto {
  @IsOptional()
  @IsString()
  targetAudience?: 'DOCTOR' | 'PATIENT';

  @IsOptional()
  @IsString()
  persona?: string;
}
