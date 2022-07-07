import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateDeviceLogicDto {
  @ApiProperty()
  @IsString()
  observableDeviceId: string;

  @ApiProperty()
  @IsString({ each: true })
  triggerDeviceIds: string[];

  @ApiProperty()
  @IsString()
  logic: string;

  @ApiProperty()
  @IsString()
  triggerSendValue: string;
}
