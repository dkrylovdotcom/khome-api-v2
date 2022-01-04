import { Injectable } from '@nestjs/common';
import * as config from 'config';
import * as mqtt from 'mqtt';
import { CommandPayloadDto } from '../device/dto/CommandPayloadDto';

const { mqttServer } = config.get('app');

type OnMessagePayload = any;

@Injectable()
export class MQTTMediator {
  private readonly client: mqtt.MqttClient;

  constructor() {
    this.client = mqtt.connect(`${mqttServer.protocol}${mqttServer.host}`);

    this.onConnect(() => {
      console.info('MQTT connected');
    });

    this.onDisconnect(() => {
      console.info('MQTT disconnected');
      // this.client.reconnect(); ??
    });

    this.onMessage((topic: string, payload: OnMessagePayload) => {
      console.log('MQTTMessagesHandler', topic, payload);
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

  public publish(commandPayload: CommandPayloadDto) {
    const topic = commandPayload.deviceId;
    console.log('publish topic', topic);
    const jsonString = JSON.stringify(commandPayload);
    this.client.publish(topic, jsonString);
  }

  public subscribe(topic: string, handler: mqtt.ClientSubscribeCallback) {
    this.client.subscribe(topic, handler);
  }

  public isConnected() {
    return this.client.connected;
  }
}
