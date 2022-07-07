import { Injectable, Inject, Logger } from '@nestjs/common';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { MQTTConnector } from '../components';
import { CommandPayloadDto } from '../consts';
import { DeviceTopic } from '../helpers/DeviceTopic';

Injectable();
export class CommandExecuteService {
  constructor(
    @Inject(MQTTConnector)
    private readonly MQTTConnector: MQTTConnector,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    private readonly logger = new Logger(CommandExecuteService.name),
  ) {}

  public async execute(payload: CommandPayloadDto) {
    const device = await this.deviceRepository.get(payload.deviceId);

    if (!device.isOnline) {
      throw new Error(device.deviceId);
    }

    const topic = DeviceTopic.get(device);

    try {
      const command = {
        deviceId: device.deviceId,
        state: payload.payload.state,
      };
      this.MQTTConnector.publish(topic, command);

      device.state = payload.payload.state;
      await this.deviceRepository.save(device);
    } catch (e: any) {
      this.logger.error(
        `[MQTT: ${topic}] ${e.getMessage()}`,
        e.stack.toString(),
      );
      throw e;
    }
  }
}
