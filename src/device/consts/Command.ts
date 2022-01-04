import { DeviceTypes } from '.';
import { CommandPayloadDto } from '../dto/CommandPayloadDto';

export type Command = {
  type: DeviceTypes;
  deviceId: string;
  locationId: string;
  payload: CommandPayloadDto;
};
