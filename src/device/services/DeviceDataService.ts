import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceData, DeviceDataDocument } from '../schemas/DeviceDataSchema';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { DeviceDataRepository } from '../repositories/DeviceDataRepository';
import { DeviceDataCreateDto } from '../dto';

Injectable();
export class DeviceDataService {
  constructor(
    @InjectModel(DeviceData.name)
    private readonly deviceDataModel: Model<DeviceDataDocument>,
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    @Inject(DeviceDataRepository)
    private readonly deviceDataRepository: DeviceDataRepository,
  ) {}

  public async create(deviceId: string, value: number) {
    const device = await this.deviceRepository.findByDeviceId(deviceId);
    if (!device) {
      throw new Error('Device not found');
    }
    const deviceDataCreateDto = new DeviceDataCreateDto();
    deviceDataCreateDto.deviceId = deviceId;
    deviceDataCreateDto.value = value;
    const deviceData = new this.deviceDataModel(deviceDataCreateDto);
    return deviceData.save();
  }

  public async removeForDevice(deviceId: string) {
    await this.deviceDataRepository.removeForDevice(deviceId);
  }
}
