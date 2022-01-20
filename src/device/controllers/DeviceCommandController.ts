import { Controller, Post, Body } from '@nestjs/common';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { DeviceControlService } from '../services/DeviceControlService';
import { CommandPayloadDto } from '../consts';

@Controller('device-command')
export class DeviceCommandController {
  constructor(private readonly deviceControlService: DeviceControlService) {}

  @Post('execute')
  public async commandExecute(@Body() commandPayloadDto: CommandPayloadDto) {
    await this.deviceControlService.commandExecute(commandPayloadDto);
    return HttpResponse.successCreated('Command successfully executed');
  }
}
