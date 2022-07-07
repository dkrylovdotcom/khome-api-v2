import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { DeviceState } from '../schemas/DeviceSchema';

export class CommandPayloadDto {
  @ApiProperty()
  @IsString()
  locationId: string;

  @ApiProperty()
  @IsString()
  deviceId: string;

  @ApiProperty()
  payload: {
    state: DeviceState;
  };
}
