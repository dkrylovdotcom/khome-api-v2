import { Injectable, Inject, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonLogic = require('json-logic-js');
import { DeviceLogicRepository, DeviceRepository } from '../repositories';
import { MQTTConnector, TimeCode } from '../components';
import { DeviceTopic } from '../helpers/DeviceTopic';
import { DeviceTypes } from '../consts';
import { DeviceLogic } from '../schemas/DeviceLogicSchema';

Injectable();
export class DeviceLogicService {
  private readonly logger = new Logger(DeviceLogicService.name);

  constructor(
    @Inject(MQTTConnector)
    private readonly MQTTConnector: MQTTConnector,
    @Inject(DeviceLogicRepository)
    private readonly deviceLogicRepository: DeviceLogicRepository,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(TimeCode)
    private readonly timeCode: TimeCode,
  ) {}

  public async handleLogic(observableDeviceId: string, value: any) {
    const deviceLogic =
      await this.deviceLogicRepository.findByObservableDeviceId(
        observableDeviceId,
      );
    if (!deviceLogic) {
      this.logger.error(
        'No handler found for',
        '',
        JSON.stringify({ observableDeviceId, value }),
      );
      return;
    }

    const observableDevice = await this.deviceRepository.findByDeviceId(
      observableDeviceId,
    );
    if (!observableDevice) {
      throw new Error(`Device "${observableDeviceId}" doesn't exist`);
    }

    switch (observableDevice.type) {
      case DeviceTypes.TEMPERATURE_SENSOR:
      case DeviceTypes.MOTION_SENSOR:
      case DeviceTypes.TOUCH_SENSOR:
        const isLogicActivated = jsonLogic.apply(deviceLogic.logic);
        if (isLogicActivated) {
          await this.triggerDevices(deviceLogic);
        }
        break;
      case DeviceTypes.QR_SCANNER:
        const code = this.timeCode.getCode();
        const isCodeValid = jsonLogic.apply({ '==': [code, value] });
        if (isCodeValid) {
          await this.triggerDevices(deviceLogic);
        }
        break;
    }
  }

  private async triggerDevices(deviceLogic: DeviceLogic) {
    for (const deviceId of deviceLogic.triggerDeviceIds) {
      const device = await this.deviceRepository.findByDeviceId(deviceId);
      if (!device) {
        return;
      }
      // if (!device.isOnline) {
      //   return;
      // }
      const commandValue = JSON.parse(deviceLogic.triggerSendValue);

      // NOTE:: just hack to test
      // commandValue[0] = value.state;

      const command = {
        deviceId,
        value: commandValue,
      };
      const topic = DeviceTopic.get(device);
      this.MQTTConnector.publish(topic, command);
    }
  }
}
