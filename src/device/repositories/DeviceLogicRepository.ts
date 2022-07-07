import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceLogic, DeviceLogicDocument } from '../schemas/DeviceLogicSchema';

Injectable();
export class DeviceLogicRepository {
  constructor(
    @InjectModel(DeviceLogic.name)
    private deviceLogicModel: Model<DeviceLogicDocument>,
  ) {}

  public async getAll(): Promise<DeviceLogic[]> {
    return await this.deviceLogicModel.find().exec();
  }

  public async findByObservableDeviceId(
    observableDeviceId: string,
  ): Promise<DeviceLogic | null> {
    return await this.deviceLogicModel.findOne({ observableDeviceId });
  }

  public async get(id: string): Promise<DeviceLogic> {
    const item = await this.deviceLogicModel.findById(id);
    if (!item) throw new Error('Device Logic not found');
    return item;
  }

  public async save(deviceLogic: DeviceLogic) {
    this.saveAll([deviceLogic]);
  }

  public async saveAll(items: DeviceLogic[]) {
    this.deviceLogicModel.bulkSave(items as DeviceLogicDocument[]);
  }

  public async remove(device: DeviceLogic) {
    await (device as DeviceLogicDocument).remove();
    // this.deviceModel.remove();
  }
}
