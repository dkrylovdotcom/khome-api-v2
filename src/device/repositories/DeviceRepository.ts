import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from '../schemas/DeviceSchema';

Injectable();
export class DeviceRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  public async getAll(): Promise<DeviceDocument[]> {
    return await this.deviceModel.find().exec();
  }

  public async findAllByLocation(locationId: string): Promise<Device[]> {
    return await this.deviceModel.find({ locationId }).exec();
  }

  public async get(id: string): Promise<DeviceDocument> {
    const item = await this.deviceModel.findById({ id });
    if (!item) throw new Error('Device not found');
    return item;
  }

  public async save(device: DeviceDocument) {
    device.save();
  }

  public async saveAll(items: DeviceDocument[]) {
    this.deviceModel.bulkSave(items);
  }

  public async remove(device: DeviceDocument) {
    await device.remove();
  }
}
