export class DeviceOfflineException extends Error {
  constructor(deviceId: string) {
    super(`Device "${deviceId}" is offline`);
  }
}
