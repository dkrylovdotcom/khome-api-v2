import { DeviceTypes } from '../consts/DeviceTypes';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeviceDto {
  @ApiProperty()
  locationId: string;

  @ApiProperty()
  mac: string;

  @ApiProperty()
  type: DeviceTypes;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  minCriticalValue: number;

  @ApiProperty()
  maxCriticalValue: number;
}
