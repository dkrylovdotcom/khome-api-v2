import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from '../schemas/LocationSchema';

Injectable();
export class LocationRepository {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
  ) {}

  public async getAll(): Promise<LocationDocument[]> {
    return await this.locationModel.find({});
  }

  public async get(id: string): Promise<LocationDocument> {
    const item = await this.locationModel.findById({ id });
    if (!item) throw new Error('Location not found');
    return item;
  }

  public async save(item: LocationDocument) {
    await item.save();
  }

  public async remove(id: string) {
    await this.locationModel.findByIdAndRemove(id);
  }
}
