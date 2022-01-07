import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from '../schemas/DeviceSchema';

Injectable();
export class DeviceRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}

  public async getAll(): Promise<Device[]> {
    return await this.deviceModel.find().exec();
  }

  public async findAllByLocation(locationId: string): Promise<Device[]> {
    return await this.deviceModel.find({ locationId }).exec();
  }

  public async findByDeviceId(deviceId: string): Promise<Device | null> {
    return await this.deviceModel.findOne({ deviceId });
  }

  public async get(id: string): Promise<Device> {
    const item = await this.deviceModel.findById(id);
    if (!item) throw new Error('Device not found');
    return item;
  }

  public async save(device: Device) {
    this.saveAll([device]);
  }

  public async saveAll(items: Device[]) {
    this.deviceModel.bulkSave(items as DeviceDocument[]);
  }

  public async remove(device: Device) {
    await (device as DeviceDocument).remove();
    // this.deviceModel.remove();
  }
}
