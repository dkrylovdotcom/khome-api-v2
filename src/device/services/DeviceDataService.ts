import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceData, DeviceDataDocument } from '../schemas/DeviceDataSchema';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { DeviceDataRepository } from '../repositories/DeviceDataRepository';
import { DeviceDataCreateDto } from '../dto/DeviceDataDto';

Injectable();
export class DeviceDataService {
  constructor(
    @InjectModel(DeviceData.name)
    private readonly deviceDataModel: Model<DeviceDataDocument>,
    private readonly deviceRepository: DeviceRepository,
    private readonly deviceDataRepository: DeviceDataRepository,
  ) {}

  public async create(deviceId: string, value: number) {
    await this.deviceRepository.get(deviceId);
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
