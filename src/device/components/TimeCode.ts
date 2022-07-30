import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const totp = require('totp-generator');

@Injectable()
export class TimeCode {
  private readonly timeCodeLength: number;
  private readonly timeCodeInterval: number;
  // TODO: possible, it should be different for each user
  private readonly key = 'JBSWY3DPEHPK3PXP';

  constructor(private readonly configService: ConfigService) {
    this.timeCodeLength = this.configService.get('TIMECODE_LENGTH') as number;
    this.timeCodeInterval = this.configService.get('TIMECODE_INTERVAL') as number;
  }

  public getCode() {
    return totp(this.key, {
      digits: this.timeCodeLength,
      period: this.timeCodeInterval,
    });
  }
}
