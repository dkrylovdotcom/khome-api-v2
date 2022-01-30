import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceLogic, DeviceLogicDocument } from '../schemas/DeviceLogicSchema';
import { DeviceLogicRepository } from '../repositories';
import { CreateDeviceLogicDto, UpdateDeviceLogicDto } from '../dto';

Injectable();
export class DeviceLogicCrudService {
  constructor(
    @InjectModel(DeviceLogic.name)
    private deviceLogicModel: Model<DeviceLogicDocument>,
    @Inject(DeviceLogicRepository)
    private readonly deviceLogicRepository: DeviceLogicRepository,
  ) {}

  public async create(createDeviceLogicDto: CreateDeviceLogicDto) {
    // TODO:: this.validateLogic(createDeviceLogicDto.logic);
    const deviceLogic = new this.deviceLogicModel(createDeviceLogicDto);
    await this.deviceLogicRepository.save(deviceLogic);
    return deviceLogic;
  }

  public async update(id: string, updateDeviceLogicDto: UpdateDeviceLogicDto) {
    // TODO:: this.validateLogic(createDeviceLogicDto.logic);
    const item = await this.deviceLogicRepository.get(id);
    item.observableDeviceId = updateDeviceLogicDto.observableDeviceId;
    item.triggerDeviceIds = updateDeviceLogicDto.triggerDeviceIds;
    item.logic = updateDeviceLogicDto.logic;
    item.triggerSendValue = updateDeviceLogicDto.triggerSendValue;
    await this.deviceLogicRepository.save(item);
  }

  public async remove(id: string) {
    const deviceLogic = await this.deviceLogicRepository.get(id);
    await this.deviceLogicRepository.remove(deviceLogic);
  }
}
