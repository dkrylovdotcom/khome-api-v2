import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import md5 from 'md5';

@Injectable()
export class TimeCode {
  constructor(private readonly configService: ConfigService) {}

  public getCode() {
    const timeCodeInterval = this.configService.get('TIMECODE_INTERVAL');
    const timeCodeLength = this.configService.get('TIMECODE_LENGTH');
    const timestamp = Date.now();
    const intervalStarted = this.nok(timestamp, timeCodeInterval);
    const intervalEnd = this.nod([timestamp, timeCodeInterval]);

    if (timestamp > intervalStarted && timestamp < intervalEnd) {
      const hashedString = md5(intervalEnd.toString());
      const numbers = parseInt(hashedString).toFixed(timeCodeLength);
      return numbers;
    }
  }

  private nod(A: any) {
    const n = A.length;
    let x = Math.abs(A[0]);
    for (let i = 1; i < n; i++) {
      let y = Math.abs(A[i]);
      while (x && y) {
        x > y ? (x %= y) : (y %= x);
      }
      x += y;
    }
    return x;
  }

  private gcd(n: any, m: any): any {
    return m == 0 ? n : this.gcd(m, n % m);
  }

  private nok(n: any, m: any) {
    return (n * m) / this.gcd(n, m);
  }
}
