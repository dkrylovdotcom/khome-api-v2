import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from '../schemas/DeviceSchema';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { CreateDeviceDto, UpdateDeviceDto } from '../dto/DeviceDto';

Injectable();
export class DeviceCrudService {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  public async create(createDeviceDto: CreateDeviceDto) {
    try {
      const device = new this.deviceModel(createDeviceDto);
      device.apiKey = this.generateApiKey();
      await this.deviceRepository.save(device);
    } catch (e) {
      console.log(e);
    }
  }

  public async update(id: string, updateDeviceDto: UpdateDeviceDto) {
    const item = await this.deviceRepository.get(id);
    item.locationId = updateDeviceDto.locationId;
    item.mac = updateDeviceDto.mac;
    item.type = updateDeviceDto.type;
    item.minCriticalValue = updateDeviceDto.minCriticalValue;
    item.maxCriticalValue = updateDeviceDto.maxCriticalValue;
    await this.deviceRepository.save(item);
  }

  public async remove(id: string) {
    const device = await this.deviceRepository.get(id);
    await this.deviceRepository.remove(device);
  }

  private generateApiKey() {
    const random = Math.random();
    const sha256 = crypto.createHash('sha256');
    const data = sha256.update(String(random), 'utf-8');
    const hash = data.digest('hex');
    return hash;
  }
}
