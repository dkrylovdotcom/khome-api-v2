import { Injectable } from '@nestjs/common';
import * as config from 'config';
import { IpDefiner } from '../components/IpDefiner';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { MQTTMediator } from '../../core/MQTTMediator';
import { CommandPayloadDto, ArpScanRecord, DeviceTypes } from '../consts';
import { Device } from '../schemas/DeviceSchema';

const { scanOptions } = config.get('device');

Injectable();
export class DeviceControlService {
  private readonly MQTTReceivers = [DeviceTypes.MOTION_SENSOR];
  private readonly ipDefiner = new IpDefiner(
    scanOptions.pingTimeout,
    scanOptions.pingCount,
  );

  constructor(
    // TODO:: These classes doesn't inject, \__([]-[])__/
    private readonly mqttMediator: MQTTMediator,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  public async commandExecute(payload: CommandPayloadDto) {
    try {
      const device = await this.deviceRepository.get(payload.deviceId);

      if (!device.isOnline) {
        throw new Error(`Device "${device.deviceId}" is offline`);
      }

      payload.deviceId = device.deviceId;
      this.mqttMediator.publish(payload);

      // TODO:: save state - device.state = { ...device.state, ...payload.state };
      await this.deviceRepository.save(device);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  public async subscribeToMQTT() {
    const devices = await this.deviceRepository.getAll();
    for (const device of devices) {
      const { deviceId: topic, type } = device;

      if (!this.MQTTReceivers.includes(type)) {
        continue;
      }

      this.mqttMediator.subscribe(topic, (err: any) => {
        if (err) {
          console.log(`MQTT Error on topic ${topic}`, err);
        }
      });
      console.warn(`Device ${type} subscribed to MQTT`);
    }
  }

  public async startIpDefining() {
    let isInProgress = false;
    // TODO:: unkomment
    // setInterval(async () => {
    if (isInProgress) {
      return;
    }
    isInProgress = true;
    const devices = await this.deviceRepository.getAll();
    const definedDevices = await this.getDefinedDevices(devices);
    await this.deviceRepository.saveAll(definedDevices);
    isInProgress = false;
    // }, scanOptions.interval);
  }

  private async getDefinedDevices(devices: Device[]): Promise<Device[]> {
    const macAddresses = devices.map(({ mac }) => mac);
    const arpResults: ArpScanRecord[] = await this.ipDefiner.filterOnlineByMac(
      macAddresses,
    );

    const definedDevices = [...devices];
    for (const device of definedDevices) {
      const result = arpResults.find((item: any) => item.mac === device.mac);

      // device.ip = '';
      device.isOnline = false;
      if (result) {
        device.ip = result.ip;
        device.isOnline = true;
      }
    }
    return definedDevices;
  }
}
