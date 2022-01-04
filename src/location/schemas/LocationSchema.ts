import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ type: Date, required: true, default: Date.now })
  createdAt: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
