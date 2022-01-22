import { ApiProperty } from '@nestjs/swagger';
import { DeviceState } from '../schemas/DeviceSchema';

export class CommandPayloadDto {
  @ApiProperty()
  locationId: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  payload: {
    state: DeviceState;
  };
}
