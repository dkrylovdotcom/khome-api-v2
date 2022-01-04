import * as config from 'config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './controllers/DeviceController';
import { DeviceDataController } from './controllers/DeviceDataController';
import { DeviceCommandController } from './controllers/DeviceCommandController';
import { DeviceDataService } from './services/DeviceDataService';
import { DeviceCrudService } from './services/DeviceCrudService';
import { DeviceRepository } from './repositories/DeviceRepository';
import { DeviceDataRepository } from './repositories/DeviceDataRepository';
import { DeviceControlService } from './services/DeviceControlService';
import { Device, DeviceSchema, DeviceDocument } from './schemas/DeviceSchema';
import { DeviceData, DeviceDataSchema } from './schemas/DeviceDataSchema';
import { CoreModule } from '../core/CoreModule';
import { DeviceTypes, ArpScanRecord } from './consts';
import { IpDefiner } from './components/IpDefiner';
import { MQTTMediator } from '../core/MQTTMediator';

const { scanOptions } = config.get('device');
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: DeviceData.name, schema: DeviceDataSchema },
    ]),
    CoreModule,
  ],
  controllers: [
    DeviceController,
    DeviceDataController,
    DeviceCommandController,
  ],
  providers: [
    DeviceDataService,
    DeviceCrudService,
    DeviceControlService,
    DeviceRepository,
    DeviceDataRepository,
  ],
})
export class DeviceModule {
  // TODO:: need to uncomment, but it's not working
  // constructor(private readonly deviceControlService: DeviceControlService) {
  //   this.deviceControlService.startIpDefining();
  //   this.deviceControlService.subscribeToMQTT();
  // }

  // TODO:: All code above should be used through DeviceControlService
  private readonly MQTTReceivers = [DeviceTypes.MOTION_SENSOR];
  private readonly ipDefiner = new IpDefiner(
    scanOptions.pingTimeout,
    scanOptions.pingCount,
  );

  constructor(
    private readonly mqttMediator: MQTTMediator,
    private readonly deviceRepository: DeviceRepository,
  ) {
    this.startIpDefining();
    this.subscribeToMQTT();
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

  private async getDefinedDevices(
    devices: DeviceDocument[],
  ): Promise<DeviceDocument[]> {
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
