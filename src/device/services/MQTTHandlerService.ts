import { Injectable } from '@nestjs/common';
import { DeviceDataService } from './DeviceDataService';
import { DeviceTypes } from '../consts';
import { DeviceRepository } from '../repositories/DeviceRepository';

Injectable();
export class MQTTHandlerService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly deviceDataService: DeviceDataService,
  ) {}

  public async handle(topic: any, payload: any) {
    try {
      const json = this.getObject(payload);
      console.log(topic, json);
      const { deviceId, value } = json;
      const device = await this.deviceRepository.findByDeviceId(deviceId);

      if (!device) {
        throw new Error(`Device "${deviceId}" doesn't exist`);
      }

      switch (device.type) {
        case DeviceTypes.TEMPERATURE_SENSOR:
        case DeviceTypes.MOTION_SENSOR:
          return await this.deviceDataService.create(deviceId, value);
      }
    } catch (e) {
      console.log(e);
    }
  }

  private getObject(payload: any) {
    const json = JSON.parse(payload.toString());
    try {
      json.value = JSON.parse(json.value);
    } catch (e) {
      console.log(e);
    }
    return json;
  }
}
