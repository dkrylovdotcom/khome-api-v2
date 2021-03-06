import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DeviceDataDocument = DeviceData & Document;

@Schema()
export class DeviceData {
  @Prop({ required: true, trim: true })
  deviceId: string;

  @Prop()
  value: string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

export const DeviceDataSchema = SchemaFactory.createForClass(DeviceData);
