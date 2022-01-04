import { ArpScanRecord } from '../consts';

export class IpDefiner {
  private _ping = require('ping');
  private _arpScanner = require('arpscan/promise');

  constructor(
    private readonly _pingCount: number,
    private readonly _pingTimeout: number,
  ) {}

  public async filterOnlineByMac(
    macAddresses: string[],
  ): Promise<ArpScanRecord[]> {
    const arpResults: ArpScanRecord[] = await this._arpScanner();
    return arpResults.filter(({ mac }) => {
      return macAddresses.includes(mac);
    });
  }

  public async checkDeviceStatus(ip: string) {
    const pingResult = await this._ping.promise.probe(ip, {
      timeout: this._pingTimeout,
      extra: ['-c', this._pingCount],
    });
    return pingResult.alive;
  }
}
