import {
  Param,
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Post,
} from '@nestjs/common';
import { LocationService } from '../services/LocationService';
import { LocationRepository } from '../repositories/LocationRepository';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { CreateLocationDto, UpdateLocationDto } from '../dto';

@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly locationRepository: LocationRepository,
  ) {}

  @Get('all')
  public async getAll() {
    const items = await this.locationRepository.getAll();
    return HttpResponse.successData({ items });
  }

  @Get()
  public async get(@Param('id') id: string) {
    const item = await this.locationRepository.get(id);
    return HttpResponse.successData({ item });
  }

  @Post()
  public async create(@Body() createLocationDto: CreateLocationDto) {
    await this.locationService.create(createLocationDto);
    return HttpResponse.successCreated();
  }

  @Patch()
  public async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    await this.locationService.update(id, updateLocationDto);
    return HttpResponse.successUpdated();
  }

  @Delete()
  public async delete(id: string) {
    await this.locationService.remove(id);
    return HttpResponse.successDeleted(id);
  }
}
