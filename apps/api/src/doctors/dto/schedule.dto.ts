import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateScheduleDto {
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek!: number; // 0=Sunday, ..., 6=Saturday

  @IsString()
  @IsNotEmpty({ message: 'Jam mulai tidak boleh kosong' })
  startTime!: string; // "09:00"

  @IsString()
  @IsNotEmpty({ message: 'Jam selesai tidak boleh kosong' })
  endTime!: string; // "14:00"

  @IsOptional()
  @IsInt()
  @Min(1)
  maxPatients?: number = 20;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class UpdateScheduleDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek?: number;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxPatients?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
