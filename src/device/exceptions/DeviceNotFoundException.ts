export class DeviceNotFoundException extends Error {
  constructor() {
    super('Device not found');
  }
}
