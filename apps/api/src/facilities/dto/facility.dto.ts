import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum FacilityType {
  ALL = 'ALL',
  CLINIC = 'CLINIC',
  HOSPITAL = 'HOSPITAL',
  PHARMACY = 'PHARMACY',
  LABORATORY = 'LABORATORY',
  PUSKESMAS = 'PUSKESMAS',
  EMERGENCY = 'EMERGENCY',
  OTHER = 'OTHER',
}

export enum RouteAlgorithm {
  A_STAR = 'A_STAR',
  DIJKSTRA = 'DIJKSTRA',
}

export class QueryFacilitiesDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(FacilityType)
  type?: FacilityType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxDistance?: number; // in kilometers (e.g. 1, 5, 10, 20)

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number; // e.g. 3, 4, 4.5

  @IsOptional()
  @IsString()
  services?: string; // comma-separated e.g. "BPJS,Telemedicine"

  @IsOptional()
  @IsString()
  openStatus?: 'ALL' | 'OPEN_NOW' | 'EMERGENCY_24H';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'DISTANCE' | 'RATING' | 'NAME';
}

export class QueryRouteDto {
  @Type(() => Number)
  @IsNumber()
  originLat!: number;

  @Type(() => Number)
  @IsNumber()
  originLng!: number;

  @Type(() => Number)
  @IsNumber()
  destLat!: number;

  @Type(() => Number)
  @IsNumber()
  destLng!: number;

  @IsOptional()
  @IsEnum(RouteAlgorithm)
  mode?: RouteAlgorithm = RouteAlgorithm.A_STAR;
}

export class CreateFacilityDto {
  @IsString()
  name!: string;

  @IsEnum(FacilityType)
  type!: FacilityType;

  @IsString()
  address!: string;

  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @Type(() => Number)
  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  operatingHours?: string;

  @IsOptional()
  services?: string[];
}
