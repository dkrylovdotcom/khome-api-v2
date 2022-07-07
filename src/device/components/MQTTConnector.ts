import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';

type OnMessagePayload = any;

@Injectable()
export class MQTTConnector {
  private readonly client: mqtt.MqttClient;

  constructor(
    private readonly logger = new Logger(MQTTConnector.name),
    private readonly configService: ConfigService,
  ) {
    const mqttUri = this.configService.get('MQTT_HOST');
    this.client = mqtt.connect(mqttUri);

    this.onConnect(() => {
      this.logger.log(`[MQTT] Connected]`);
    });

    this.onDisconnect(() => {
      console.info(`[MQTT] Disconnected`);
      // this.client.reconnect(); ??
    });

    this.onMessage((topic: string, payload: OnMessagePayload) => {
      this.logger.log(
        `[MQTT: ${topic}] OnMessage`,
        undefined,
        payload.toString(),
      );
    });
  }

  public onConnect(func: mqtt.OnConnectCallback) {
    this.client.on('connect', func);
  }

  public onDisconnect(func: mqtt.OnDisconnectCallback) {
    this.client.on('disconnect', func);
  }

  public onMessage(func: mqtt.OnMessageCallback) {
    this.client.on('message', func);
  }

  public publish(topic: string, command: any) {
    const jsonString = JSON.stringify(command);
    this.logger.log(`[MQTT: ${topic}] Publish command`, undefined, jsonString);
    this.client.publish(topic, jsonString);
  }

  public subscribe(topic: string, handler: mqtt.ClientSubscribeCallback) {
    this.client.subscribe(topic, handler);
  }

  public isConnected() {
    return this.client.connected;
  }
}
