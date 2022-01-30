import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceLogicDto {
  @ApiProperty()
  observableDeviceId: string;

  @ApiProperty()
  triggerDeviceIds: string[];

  @ApiProperty()
  logic: string;

  @ApiProperty()
  triggerSendValue: string;
}
