import {
  Param,
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LocationService } from '../services/LocationService';
import { LocationRepository } from '../repositories/LocationRepository';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { CreateLocationDto, UpdateLocationDto } from '../dto';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(
    private readonly locationService: LocationService,
    private readonly locationRepository: LocationRepository,
  ) {}

  @ApiOperation({ summary: 'Get all Locations' })
  @Get('all')
  public async getAll() {
    const items = await this.locationRepository.getAll();
    return HttpResponse.successData(items);
  }

  @ApiOperation({ summary: 'Get Location by ID' })
  @Get()
  public async get(@Param('id') id: string) {
    const item = await this.locationRepository.get(id);
    return HttpResponse.successData(item);
  }

  @ApiOperation({ summary: 'Create Location' })
  @Post()
  public async create(@Body() createLocationDto: CreateLocationDto) {
    await this.locationService.create(createLocationDto);
    return HttpResponse.successCreated();
  }

  @ApiOperation({ summary: 'Update Location' })
  @Patch()
  public async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    await this.locationService.update(id, updateLocationDto);
    return HttpResponse.successUpdated();
  }

  @ApiOperation({ summary: 'Delete Location' })
  @Delete()
  public async delete(id: string) {
    await this.locationService.remove(id);
    return HttpResponse.successDeleted(id);
  }
}
