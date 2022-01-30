import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceLogicDocument = DeviceLogic & Document;

// К примеру
// observableDeviceId = мотион сенсор
// triggerDeviceIds = девайсы, которые триггерим (например камера со считываетелем QR)
// logic = { ">=" : [valueOfObservableDevice, someTriggeringValue] }
// triggerSendValue = { "deviceId": "123", "action": "turnOn" } - это отправляется в MQTT и девайс включается (проходя цикл loop дальше)

@Schema()
export class DeviceLogic {
  @Prop({ unique: true, required: true, trim: true })
  observableDeviceId: string;

  @Prop({ required: true, trim: true })
  triggerDeviceIds: string[];

  @Prop({ required: true, trim: true })
  logic: string;

  @Prop({ required: true, trim: true })
  triggerSendValue: string;

  @Prop({ type: Date, required: true, default: Date.now })
  lastUpdatedAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

export const DeviceLogicSchema = SchemaFactory.createForClass(DeviceLogic);
