import { Device } from '../schemas/DeviceSchema';

export class DeviceTopic {
  public static get(device: Device) {
    return `${device.type}-${device.locationId}`;
  }
}
