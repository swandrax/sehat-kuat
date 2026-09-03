import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class ClassifySymptomDto {
  @IsString()
  @IsNotEmpty()
  symptoms: string;
}

export class PredictHealthRiskDto {
  @IsNumber()
  age: number;

  @IsNumber()
  systolic: number;

  @IsNumber()
  diastolic: number;

  @IsString()
  @IsOptional()
  condition?: string;
}
