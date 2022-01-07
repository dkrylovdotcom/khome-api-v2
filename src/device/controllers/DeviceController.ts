import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Post,
} from '@nestjs/common';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { DeviceCrudService } from '../services';
import { UpdateDeviceDto, CreateDeviceDto } from '../dto/DeviceDto';

@Controller('device')
export class DeviceController {
  constructor(
    private readonly deviceCrudService: DeviceCrudService,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  @Get('all')
  public async getAll() {
    const items = await this.deviceRepository.getAll();
    return HttpResponse.successData({ items });
  }

  @Get('/:locationId')
  public async findAllByLocation(@Param('locationId') locationId: string) {
    const items = await this.deviceRepository.findAllByLocation(locationId);
    return HttpResponse.successData({ items });
  }

  @Get('/:id')
  public async get(@Param('id') id: string) {
    const item = await this.deviceRepository.get(id);
    return HttpResponse.successData({ item });
  }

  @Post()
  public async create(@Body() createDeviceDto: CreateDeviceDto) {
    const device = await this.deviceCrudService.create(createDeviceDto);
    return HttpResponse.successData({ deviceId: device.id });
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateDeviceDto: UpdateDeviceDto,
  ) {
    await this.deviceCrudService.update(id, updateDeviceDto);
    return HttpResponse.successUpdated();
  }

  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    await this.deviceCrudService.remove(id);
    return HttpResponse.successDeleted();
  }
}
