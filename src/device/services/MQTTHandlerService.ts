import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { DeviceDataService, DeviceLogicService } from './';
import { DeviceTypes } from '../consts';
import { DeviceRepository } from '../repositories/DeviceRepository';

Injectable();
export class MQTTHandlerService {
  constructor(
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(DeviceDataService)
    private readonly deviceDataService: DeviceDataService,
    @Inject(forwardRef(() => DeviceLogicService))
    private readonly deviceLogicService: DeviceLogicService,
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
          return await this.deviceDataService.create(device.deviceId, value);
      }

      await this.deviceLogicService.handleLogic(device.deviceId, value);
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
