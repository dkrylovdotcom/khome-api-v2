import { Injectable, Inject, Logger } from '@nestjs/common';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { MQTTConnector } from '../components';
import { CommandPayloadDto } from '../consts';
import { DeviceTopic } from '../helpers/DeviceTopic';

Injectable();
export class CommandExecuteService {
  private readonly logger = new Logger(CommandExecuteService.name);

  constructor(
    @Inject(MQTTConnector)
    private readonly MQTTConnector: MQTTConnector,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
  ) {}

  public async execute(payload: CommandPayloadDto) {
    const device = await this.deviceRepository.get(payload.deviceId);

    if (!device.isOnline) {
      throw new Error(
        `Device ${device.deviceId} is offline. Can't send the command`,
      );
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
