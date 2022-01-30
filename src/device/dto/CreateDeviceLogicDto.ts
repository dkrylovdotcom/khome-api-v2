import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceLogicDto {
  @ApiProperty()
  observableDeviceId: string;

  @ApiProperty()
  triggerDeviceIds: string[];

  @ApiProperty()
  logic: string;

  @ApiProperty()
  triggerSendValue: string;
}
