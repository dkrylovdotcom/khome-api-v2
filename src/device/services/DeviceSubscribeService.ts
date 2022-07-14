import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { MQTTConnector } from '../components/MQTTConnector';
import { MQTTHandlerService } from './MQTTHandlerService';
import { DeviceTypes } from '../consts';
import { DeviceTopic } from '../helpers/DeviceTopic';

Injectable();
export class DeviceSubscribeService implements OnModuleInit {
  private readonly MQTTReceivers = [
    DeviceTypes.MOTION_SENSOR,
    DeviceTypes.TEMPERATURE_SENSOR,
    DeviceTypes.TOUCH_SENSOR,
    DeviceTypes.QR_SCANNER,
  ];
  private readonly logger = new Logger(DeviceSubscribeService.name);

  constructor(
    @Inject(MQTTConnector)
    private readonly MQTTConnector: MQTTConnector,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(MQTTHandlerService)
    private readonly MQTTHandlerService: MQTTHandlerService,
  ) {}

  onModuleInit() {
    this.subscribeToMQTT();
  }

  private async subscribeToMQTT() {
    await this.subscribeAllTopics();

    this.MQTTConnector.onMessage(async (topic, payload) => {
      this.logger.log(
        `[MQTT: ${topic}] Received Message`,
        undefined,
        payload.toString(),
      );
      await this.MQTTHandlerService.handle(topic, payload);
    });
  }

  private async subscribeAllTopics() {
    const devices = await this.deviceRepository.getAll();
    for (const device of devices) {
      const topic = DeviceTopic.get(device);
      if (!this.MQTTReceivers.includes(device.type)) {
        this.logger.warn(
          `[MQTT: ${topic}] device ${device.deviceId} is not MQTTReceiver`,
        );
        continue;
      }

      // NOTE: test device
      // MAC: 80:7d:3a:7f:ee:8 ? 0
      // DeviceId: esp1
      this.MQTTConnector.subscribe(topic, (err: any) => {
        if (err) {
          this.logger.error(`[MQTT: ${topic}] Error on topic`, err);
          return;
        }
        this.logger.log(
          `[MQTT: ${topic}] Device [${device.type}] ${device.deviceId} subscribed`,
        );
      });
    }
  }
}
