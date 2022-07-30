import { Injectable, Inject, Logger } from '@nestjs/common';
// import jsonLogic from 'json-logic-js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonLogic = require('json-logic-js');
import { DeviceLogicRepository, DeviceRepository } from '../repositories';
import { MQTTConnector, TimeCode } from '../components';
import { DeviceTopic } from '../helpers/DeviceTopic';
import { DeviceTypes } from '../consts';
import { DeviceLogic } from '../schemas/DeviceLogicSchema';
import { Device } from '../schemas/DeviceSchema';

export type DeviceLogicValue = any;

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

  public async handleLogic(
    observableDeviceId: string,
    value: DeviceLogicValue,
  ) {
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
        const isLogicActivated = jsonLogic.apply(deviceLogic.logic, value);
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
    const { triggerDeviceIds, triggerSendValue } = deviceLogic;
    const devicesMap = await this.getMappedDevices(triggerDeviceIds);
    for (const deviceId of triggerDeviceIds) {
      const device = devicesMap.get(deviceId);
      if (!device) {
        this.logger.error(`Triggered device ${deviceId} not found`);
        return;
      }
      // if (!device.isOnline) {
      //   return;
      // }
      const commandValue = JSON.parse(triggerSendValue);

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

  private async getMappedDevices(deviceIds: string[]) {
    const devices = await this.deviceRepository.findAllByDeviceId(deviceIds);
    const map = new Map<string, Device>();
    for (const device of devices) {
      map.set(device.deviceId, device);
    }
    return map;
  }
}
