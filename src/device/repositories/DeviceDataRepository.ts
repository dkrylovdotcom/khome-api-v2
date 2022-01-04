import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceData, DeviceDataDocument } from '../schemas/DeviceDataSchema';

Injectable();
export class DeviceDataRepository {
  constructor(
    @InjectModel(DeviceData.name)
    private deviceDataModel: Model<DeviceDataDocument>,
  ) {}

  public async getLastValues() {
    return await this.deviceDataModel
      .aggregate()
      .group({
        _id: {
          locationId: '$locationId',
          deviceId: '$deviceId',
        },
        value: { $last: '$value' },
        createdAt: { $last: '$createdAt' },
      })
      .sort({
        createdAt: -1,
      })
      .project({
        _id: false,
        locationId: '$_id.locationId',
        deviceId: '$_id.deviceId',
        value: '$value',
        createdAt: '$createdAt',
      });
  }

  public async findAllByLocation(
    locationId: string,
  ): Promise<DeviceDataDocument[]> {
    return await this.deviceDataModel.find({ locationId }).exec();
  }

  public async findAllByDevice(
    deviceId: string,
  ): Promise<DeviceDataDocument[]> {
    return await this.deviceDataModel.find({ deviceId }).exec();
  }

  public async save(item: DeviceDataDocument) {
    await item.save();
  }

  public async removeForDevice(deviceId: string) {
    await this.deviceDataModel.remove({ deviceId });
  }
}
