import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ArpScanRecord } from '../consts';

@Injectable()
export class IpDefiner {
  private readonly ping = require('ping');
  private readonly arpScanner = require('arpscan/promise');
  private readonly pingCount: number;
  private readonly pingTimeout: number;

  constructor(private readonly configService: ConfigService) {
    // TODO:: config types
    this.pingCount = this.configService.get('DEVICE_PING_TIMEOUT') as number;
    this.pingTimeout = this.configService.get('DEVICE_PING_COUNT') as number;
  }

  public async filterOnlineByMac(
    macAddresses: string[],
  ): Promise<ArpScanRecord[]> {
    const arpResults: ArpScanRecord[] = await this.arpScanner();
    return arpResults.filter(({ mac }) => {
      return macAddresses.includes(mac);
    });
  }

  public async checkDeviceStatus(ip: string) {
    const pingResult = await this.ping.promise.probe(ip, {
      timeout: this.pingTimeout,
      extra: ['-c', this.pingCount],
    });
    return pingResult.alive;
  }
}
