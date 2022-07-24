import { Param, Controller, Get, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DeviceDataRepository } from '../repositories/DeviceDataRepository';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { DeviceDataService } from '../services';

@ApiTags('Device Data')
@Controller('device-data')
export class DeviceDataController {
  constructor(
    private readonly deviceDataRepository: DeviceDataRepository,
    private readonly deviceDataService: DeviceDataService,
  ) {}

  @ApiOperation({ summary: 'Get last values of Devices' })
  @Get()
  public async getLastValues() {
    const lastValues = await this.deviceDataRepository.getLastValues();
    return HttpResponse.successData(lastValues);
  }

  @ApiOperation({ summary: 'Get DeviceData by Location ID' })
  @Get('/:locationId')
  public async getAllByLocation(@Param('locationId') locationId: string) {
    const items = await this.deviceDataRepository.findAllByLocation(locationId);
    return HttpResponse.successData(items);
  }

  @ApiOperation({ summary: 'Get DeviceData by Device ID' })
  @Get('/:deviceId')
  public async findAllByDevice(@Param('deviceId') deviceId: string) {
    const items = await this.deviceDataRepository.findAllByDevice(deviceId);
    return HttpResponse.successData(items);
  }

  @ApiOperation({ summary: 'Delete DeviceData by Device ID' })
  @Delete('/:deviceId')
  public async deleteForDevice(@Param('deviceId') deviceId: string) {
    await this.deviceDataService.removeForDevice(deviceId);
    return HttpResponse.successDeleted();
  }
}
