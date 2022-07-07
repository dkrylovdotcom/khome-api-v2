import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeviceTypes } from '../../device/consts/DeviceTypes';

export type DeviceDocument = Device & Document;
export type DeviceState = string; // TODO:: state in JSON
export class DeviceCron {
  public timePattern: string;
  public function: string;
}

@Schema()
export class Device {
  @Prop({ unique: true, required: true, trim: true })
  deviceId: string;

  @Prop()
  locationId: string;

  @Prop({ required: true, trim: true })
  type: DeviceTypes;

  @Prop({ required: true, trim: true })
  apiKey: string;

  @Prop({ required: true, trim: true })
  mac: string;

  @Prop({ trim: true })
  ip: string;

  @Prop()
  isOnline: boolean;

  @Prop()
  state: DeviceState;

  @Prop()
  cron: DeviceCron;

  @Prop()
  minCriticalValue?: number;

  @Prop()
  maxCriticalValue?: number;

  @Prop({ required: true, default: Date.now })
  lastUpdatedAt: Date;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
