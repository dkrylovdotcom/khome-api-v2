import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { CommandExecuteService } from '../services/CommandExecuteService';
import { CommandPayloadDto } from '../consts';

@ApiTags('Device')
@Controller('device-command')
export class DeviceCommandController {
  constructor(private readonly commandExecuteService: CommandExecuteService) {}

  @ApiOperation({ summary: 'Send command to Device' })
  @Post('execute')
  public async commandExecute(@Body() commandPayloadDto: CommandPayloadDto) {
    await this.commandExecuteService.execute(commandPayloadDto);
    return HttpResponse.successMessage('Command successfully executed');
  }
}
