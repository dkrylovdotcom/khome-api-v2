import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeviceDataCreateDto {
  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  @IsString()
  value: number;
}
