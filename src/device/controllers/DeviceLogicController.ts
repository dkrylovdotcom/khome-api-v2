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
import { DeviceLogicRepository } from '../repositories/DeviceLogicRepository';
import { DeviceLogicCrudService } from '../services';
import { CreateDeviceLogicDto } from '../dto/CreateDeviceLogicDto';
import { UpdateDeviceLogicDto } from '../dto/UpdateDeviceLogicDto';

@ApiTags('Device Logic')
@Controller('device-logic')
export class DeviceLogicController {
  constructor(
    private readonly deviceLogicCrudService: DeviceLogicCrudService,
    private readonly deviceLogicRepository: DeviceLogicRepository,
  ) {}

  @ApiOperation({ summary: 'Get all DeviceLogic' })
  @Get('all')
  public async getAll() {
    const items = await this.deviceLogicRepository.getAll();
    return HttpResponse.successData(items);
  }

  @ApiOperation({ summary: 'Get DeviceLogic by Device ID' })
  @Get('/by-observable/:observableDeviceId')
  public async findAllByLocation(
    @Param('observableDeviceId') observableDeviceId: string,
  ) {
    const items = await this.deviceLogicRepository.findByObservableDeviceId(
      observableDeviceId,
    );
    return HttpResponse.successData(items);
  }

  @ApiOperation({ summary: 'Create DeviceLogic' })
  @Post()
  public async create(@Body() createDeviceLogicDto: CreateDeviceLogicDto) {
    try {
      await this.deviceLogicCrudService.create(createDeviceLogicDto);
      return HttpResponse.successCreated();
    } catch (e: any) {
      return HttpResponse.error(e.status, e.message);
    }
  }

  @ApiOperation({ summary: 'Update DeviceLogic' })
  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() updateDeviceLogicDto: UpdateDeviceLogicDto,
  ) {
    await this.deviceLogicCrudService.update(id, updateDeviceLogicDto);
    return HttpResponse.successUpdated();
  }

  @ApiOperation({ summary: 'Delete DeviceLogic' })
  @Delete('/:id')
  public async delete(@Param('id') id: string) {
    await this.deviceLogicCrudService.remove(id);
    return HttpResponse.successDeleted();
  }
}
