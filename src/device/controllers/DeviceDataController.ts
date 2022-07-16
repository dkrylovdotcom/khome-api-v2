import { Param, Controller, Get, Delete } from '@nestjs/common';
import { DeviceDataRepository } from '../repositories/DeviceDataRepository';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { DeviceDataService } from '../services';

@Controller('device-data')
export class DeviceDataController {
  constructor(
    private readonly deviceDataRepository: DeviceDataRepository,
    private readonly deviceDataService: DeviceDataService,
  ) {}

  @Get()
  public async getLastValues() {
    const lastValues = await this.deviceDataRepository.getLastValues();
    return HttpResponse.successData(lastValues);
  }

  @Get('/:locationId')
  public async getAllByLocation(@Param('locationId') locationId: string) {
    const items = await this.deviceDataRepository.findAllByLocation(locationId);
    return HttpResponse.successData(items);
  }

  @Get('/:deviceId')
  public async findAllByDevice(@Param('deviceId') deviceId: string) {
    const items = await this.deviceDataRepository.findAllByDevice(deviceId);
    return HttpResponse.successData(items);
  }

  @Delete('/:deviceId')
  public async deleteForDevice(@Param('deviceId') deviceId: string) {
    await this.deviceDataService.removeForDevice(deviceId);
    return HttpResponse.successDeleted();
  }
}
