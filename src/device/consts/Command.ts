import { DeviceTypes } from '.';
import { CommandPayloadDto } from '../dto';

export type Command = {
  type: DeviceTypes;
  deviceId: string;
  locationId: string;
  payload: CommandPayloadDto;
};
