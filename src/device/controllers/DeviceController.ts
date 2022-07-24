import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { DeviceCrudService } from '../services';
import { UpdateDeviceDto, CreateDeviceDto } from '../dto';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(
    private readonly deviceCrudService: DeviceCrudService,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  @ApiOperation({ summary: 'Get all Devices' })
  @Get('all')
  public async getAll() {
    const items = await this.deviceRepository.getAll();
    return HttpResponse.successData(items);
  }

  @ApiOperation({ summary: 'Get Devices in Location' })
  @Get('/by-location/:locationId')
  public async findAllByLocation(@Param('locationId') locationId: string) {
    const items = await this.deviceRepository.findAllByLocation(locationId);
    return HttpResponse.successData(items);
  }

  @ApiOperation({ summary: 'Get Device by ID' })
  @Get('/:id')
  public async get(@Param('id') id: string) {
    const item = await this.deviceRepository.get(id);
    return HttpResponse.successData(item);
  }

  @ApiOperation({ summary: 'Create Device' })
  @Post()
  public async create(@Body() createDeviceDto: CreateDeviceDto) {
    const device = await this.deviceCrudService.create(createDeviceDto);
    return HttpResponse.successData({ deviceId: device.id });
  }

  @ApiOperation({ summary: 'Update Device' })
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    await this.deviceCrudService.update(id, updateDeviceDto);
    return HttpResponse.successUpdated();
  }

  @ApiOperation({ summary: 'Delete Device' })
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    await this.deviceCrudService.remove(id);
    return HttpResponse.successDeleted();
  }
}
