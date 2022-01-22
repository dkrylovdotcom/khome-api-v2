import { Injectable, Inject } from '@nestjs/common';
import * as config from 'config';
import { IpDefiner } from '../components/IpDefiner';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { MQTTMediator } from '../../core/MQTTMediator';
import { MQTTHandlerService } from './MQTTHandlerService';
import { CommandPayloadDto, ArpScanRecord, DeviceTypes } from '../consts';
import { Device } from '../schemas/DeviceSchema';

const { scanOptions } = config.get('device');

Injectable();
export class DeviceControlService {
  private readonly MQTTReceivers = [
    DeviceTypes.MOTION_SENSOR,
    DeviceTypes.TEMPERATURE_SENSOR,
  ];
  private readonly ipDefiner = new IpDefiner(
    scanOptions.pingTimeout,
    scanOptions.pingCount,
  );

  constructor(
    @Inject(MQTTMediator)
    private readonly mqttMediator: MQTTMediator,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(MQTTHandlerService)
    private readonly MQTTHandlerService: MQTTHandlerService,
  ) {}

  public async commandExecute(payload: CommandPayloadDto) {
    try {
      const device = await this.deviceRepository.get(payload.deviceId);

      if (!device.isOnline) {
        throw new Error(`Device "${device.deviceId}" is offline`);
      }

      const command = {
        deviceId: device.deviceId,
        state: payload.payload.state,
      };
      const topic = this.getTopicName(device);
      this.mqttMediator.publish(topic, command);

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
      if (!this.MQTTReceivers.includes(device.type)) {
        continue;
      }

      const topic = this.getTopicName(device);

      // NOTE: test device
      // MAC: 80:7d:3a:7f:ee:8 ? 0
      // DeviceId: esp1
      this.mqttMediator.subscribe(topic, (err: any) => {
        if (err) {
          console.log(`[MQTT] Error on topic ${topic}`, err);
        }
        this.mqttMediator.onMessage((topic, payload) => {
          console.log('[MQTT] Received Message:', topic, payload.toString());
          this.MQTTHandlerService.handle(topic, payload);
        });
      });
      console.warn(
        `[MQTT] Device [${device.type}] ${device.deviceId} subscribed to ${topic}`,
      );
    }
  }

  public startIpDefining() {
    let isInProgress = false;
    // TODO:: unkomment
    setInterval(async () => {
      if (isInProgress) {
        return;
      }
      isInProgress = true;
      const devices = await this.deviceRepository.getAll();
      const definedDevices = await this.getDefinedDevices(devices);
      await this.deviceRepository.saveAll(definedDevices);
      isInProgress = false;
    }, scanOptions.interval);
  }

  // TODO:: this method duplicated
  private getTopicName(device: Device) {
    return `${device.locationId}-${device.type}`;
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
