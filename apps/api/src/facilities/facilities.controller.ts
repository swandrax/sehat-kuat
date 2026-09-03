import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import {
  CreateFacilityDto,
  QueryFacilitiesDto,
  QueryRouteDto,
} from './dto/facility.dto';

@Controller('api/v1/facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get()
  findAll(@Query() query: QueryFacilitiesDto) {
    return this.facilitiesService.findAll(query);
  }

  @Get('regions/provinces')
  getProvinces() {
    return this.facilitiesService.getProvinces();
  }

  @Get('regions/regencies')
  getRegencies(@Query('provinceId') provinceId?: string) {
    return this.facilitiesService.getRegencies(provinceId);
  }

  @Get('regions/districts')
  getDistricts(@Query('regencyId') regencyId?: string) {
    return this.facilitiesService.getDistricts(regencyId);
  }

  @Get('stats/health-workers')
  getHealthWorkerStats() {
    return this.facilitiesService.getHealthWorkerStats();
  }

  @Get('route')
  calculateRoute(@Query() query: QueryRouteDto) {
    return this.facilitiesService.calculateRoute(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.facilitiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateFacilityDto) {
    return this.facilitiesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateFacilityDto>) {
    return this.facilitiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.facilitiesService.remove(id);
  }
}
