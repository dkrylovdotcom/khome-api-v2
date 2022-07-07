import { ApiProperty } from '@nestjs/swagger';
import { DeviceTypes } from '../consts/DeviceTypes';
import { IsString, IsNumberString } from 'class-validator';

export class CreateDeviceDto {
  @ApiProperty()
  @IsString()
  locationId: string;

  @ApiProperty()
  @IsString()
  mac: string;

  @ApiProperty()
  @IsString()
  type: DeviceTypes;

  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsNumberString()
  minCriticalValue: number;

  @ApiProperty()
  @IsNumberString()
  maxCriticalValue: number;
}
