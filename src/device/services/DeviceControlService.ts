import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { IpDefiner } from '../components/IpDefiner';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { MQTTConnector } from '../components/MQTTConnector';
import { MQTTHandlerService } from './MQTTHandlerService';
import { ArpScanRecord, DeviceTypes } from '../consts';
import { Device } from '../schemas/DeviceSchema';
import { DeviceTopic } from '../helpers/DeviceTopic';

// TODO:: This service looks ambigous, mqtt + ipDefining + cron?
Injectable();
export class DeviceControlService implements OnModuleInit {
  private readonly MQTTReceivers = [
    DeviceTypes.MOTION_SENSOR,
    DeviceTypes.TEMPERATURE_SENSOR,
    DeviceTypes.TOUCH_SENSOR,
  ];

  constructor(
    @Inject(MQTTConnector)
    private readonly MQTTConnector: MQTTConnector,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(MQTTHandlerService)
    private readonly MQTTHandlerService: MQTTHandlerService,
    @Inject(IpDefiner)
    private readonly ipDefiner: IpDefiner,
    private readonly logger = new Logger(DeviceControlService.name),
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.startIpDefining();
    this.subscribeToMQTT();
    this.startCronForAll();
  }

  public async startCronForAll() {
    const devices = await this.deviceRepository.getAll();
    for (const device of devices) {
      if (device.cron) {
        this.addCronJob(
          device.deviceId,
          device.cron.timePattern,
          device.cron.function,
        );
      }
    }
  }

  private addCronJob(name: string, timePattern: string, func: any) {
    const job = new CronJob(timePattern, () => {
      this.logger.log(`time for job ${name} to run!`);
      func();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.log(`job ${name} added for timePattern ${timePattern}!`);
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

  private startIpDefining() {
    let isInProgress = false;
    const scanInterval = this.configService.get('DEVICE_SCAN_INTERVAL');
    setInterval(async () => {
      if (isInProgress) {
        return;
      }
      isInProgress = true;
      const devices = await this.deviceRepository.getAll();
      const definedDevices = await this.getDefinedDevices(devices);
      await this.deviceRepository.saveAll(definedDevices);
      isInProgress = false;
    }, scanInterval);
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
