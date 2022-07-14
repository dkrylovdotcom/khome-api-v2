import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IpDefiner } from '../components/IpDefiner';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { ArpScanRecord } from '../consts';
import { Device } from '../schemas/DeviceSchema';

Injectable();
export class DeviceIpDefinitionService implements OnModuleInit {
  constructor(
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(IpDefiner)
    private readonly ipDefiner: IpDefiner,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.startIpDefining();
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
