import { Injectable, Inject } from '@nestjs/common';
import { DeviceLogicRepository, DeviceRepository } from '../repositories';
import { MQTTMediator } from '../../core/MQTTMediator';
import { Device } from '../schemas/DeviceSchema';

Injectable();
export class DeviceLogicService {
  constructor(
    @Inject(MQTTMediator)
    private readonly mqttMediator: MQTTMediator,
    @Inject(DeviceLogicRepository)
    private readonly deviceLogicRepository: DeviceLogicRepository,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
  ) {}

  public async handleLogic(observableDeviceId: string, value: any) { // TODO:: any
    const deviceLogic =
      await this.deviceLogicRepository.findByObservableDeviceId(
        observableDeviceId,
      );
    if (!deviceLogic) {
      return;
    }

    // JSON LOGIC
    // ...
    // jsonLogic.apply( { "==" : [1, value] } );

    for (const deviceId of deviceLogic.triggerDeviceIds) {
      const device = await this.deviceRepository.findByDeviceId(deviceId);
      if (!device) {
        return;
      }
      // if (device.isOnline) {
      // TODO::
      // }
      const commandValue = JSON.parse(deviceLogic.triggerSendValue);

      // NOTE:: just hack to test
      commandValue[0] = value.state;

      const command = {
        deviceId,
        value: commandValue,
      };
      const topic = this.getTopicName(device);
      this.mqttMediator.publish(topic, command);
    }
  }

  // TODO:: this method duplicated
  private getTopicName(device: Device) {
    return `${device.locationId}-${device.type}`;
  }
}
