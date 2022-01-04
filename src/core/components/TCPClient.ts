import { Socket } from 'net';
import { Injectable } from '@nestjs/common';
//import PromiseSocket from 'promise-socket';

@Injectable()
export class TCPClient {
  private socket = new Socket();
  private isConnected = false;
  //private client: PromiseSocket<Socket>;

  constructor() {
    //this.client = new PromiseSocket(this.socket);
  }

  public async connect(host: string, port: number) {
    // await this.client.connect(port, host);

    if (this.isConnected) return;

    console.log(`Connected to ${host}:${port}`);

    // this.socket.setEncoding('utf8');
    this.socket.connect(port, host, console.log);
    this.socket.on('data', (data) => {
      console.log(data.toString());
      // this.socket.destroy();
    });
    this.isConnected = true;
  }

  public disconnect() {
    //this.client.destroy();
  }

  public async sendCommand(payload: any) {
    //await this.client.write('Hello, server! Love, Client.');
    this.socket.write(JSON.stringify(payload));
    // console.log('EXECUTED: ', JSON.stringify(payload));
  }
}
