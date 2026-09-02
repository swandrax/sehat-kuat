import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChatSessionDto {
  @IsOptional()
  @IsString()
  title?: string;
}

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Role tidak boleh kosong' })
  role!: string; // user, assistant

  @IsString()
  @IsNotEmpty({ message: 'Pesan tidak boleh kosong' })
  content!: string;
}
