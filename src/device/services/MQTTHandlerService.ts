import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { DeviceDataService, DeviceLogicService } from './';
import { DeviceTypes } from '../consts';
import { DeviceRepository } from '../repositories/DeviceRepository';

Injectable();
export class MQTTHandlerService {
  private readonly logger = new Logger(MQTTHandlerService.name);

  constructor(
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(DeviceDataService)
    private readonly deviceDataService: DeviceDataService,
    @Inject(forwardRef(() => DeviceLogicService)) // NOTE:: forwardRef() to prevent dependency cycle
    private readonly deviceLogicService: DeviceLogicService,
  ) {}

  public async handle(topic: any, payload: any) {
    try {
      const json = this.getObject(payload, topic);
      this.logger.log(
        `[MQTT: ${topic}] data handle started`,
        undefined,
        json.toString(),
      );
      const { deviceId, type, value } = json;
      const device = await this.deviceRepository.findByDeviceId(deviceId);

      if (!device) {
        throw new Error(`Device "${deviceId}" doesn't exist`);
      }

      await this.deviceDataLog(deviceId, type, value);
      await this.deviceLogicService.handleLogic(deviceId, value);
    } catch (e: any) {
      this.logger.error(
        `[MQTT: ${topic}] ${e.getMessage()}`,
        e.stack.toString(),
      );
    }
  }

  private async deviceDataLog(deviceId: string, type: DeviceTypes, value: any) {
    switch (type) {
      case DeviceTypes.QR_SCANNER:
      case DeviceTypes.TEMPERATURE_SENSOR:
      case DeviceTypes.MOTION_SENSOR:
        await this.deviceDataService.create(deviceId, value);
    }
  }

  private getObject(payload: any, topic: any) {
    const json = JSON.parse(payload.toString());
    try {
      json.value = JSON.parse(json.value);
    } catch (e: any) {
      this.logger.error(
        `[MQTT: ${topic}] ${e.getMessage()}`,
        e.stack.toString(),
      );
    }
    return json;
  }
}
