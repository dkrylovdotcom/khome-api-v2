import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumberString, IsEnum } from 'class-validator';
import { DeviceTypes } from '../consts/DeviceTypes';

export class UpdateDeviceDto {
  @ApiProperty()
  @IsString()
  locationId: string;

  @ApiProperty()
  @IsString()
  mac: string;

  @ApiProperty()
  @IsEnum(DeviceTypes)
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
