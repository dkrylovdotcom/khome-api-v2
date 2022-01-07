import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeviceTypes } from '../../device/consts/DeviceTypes';

export type DeviceDocument = Device & Document;

export type DeviceState = string; // TODO:: state in JSON

@Schema()
export class Device {
  @Prop({ unique: true, required: true, trim: true })
  deviceId: string;

  @Prop()
  locationId: string;

  @Prop({ required: true, trim: true })
  type: DeviceTypes;

  @Prop({ type: String, required: true, trim: true })
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
  minCriticalValue?: number;

  @Prop()
  maxCriticalValue?: number;

  @Prop({ type: Date, required: true, default: Date.now })
  lastUpdatedAt: Date;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
