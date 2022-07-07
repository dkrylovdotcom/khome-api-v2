import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateDeviceLogicDto {
  @ApiProperty()
  @IsString()
  observableDeviceId: string;

  @ApiProperty()
  triggerDeviceIds: string[];

  @ApiProperty()
  @IsString({ each: true })
  logic: string;

  @ApiProperty()
  @IsString()
  triggerSendValue: string;
}
