import { ApiProperty } from '@nestjs/swagger';

export class DeviceDataCreateDto {
  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  value: number;
}
