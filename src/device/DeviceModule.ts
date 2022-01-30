import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './controllers/DeviceController';
import { DeviceDataController } from './controllers/DeviceDataController';
import { DeviceCommandController } from './controllers/DeviceCommandController';
import {
  DeviceDataService,
  DeviceCrudService,
  DeviceControlService,
  DeviceLogicCrudService,
  DeviceLogicService,
  MQTTHandlerService,
} from './services';
import { DeviceDataRepository } from './repositories/DeviceDataRepository';
import { Device, DeviceSchema } from './schemas/DeviceSchema';
import { DeviceData, DeviceDataSchema } from './schemas/DeviceDataSchema';
import { CoreModule } from '../core/CoreModule';
import { DeviceLogicController } from './controllers/DeviceLogicController';
import { DeviceRepository, DeviceLogicRepository } from './repositories';
import { DeviceLogic, DeviceLogicSchema } from './schemas/DeviceLogicSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: DeviceData.name, schema: DeviceDataSchema },
      { name: DeviceLogic.name, schema: DeviceLogicSchema },
    ]),
    CoreModule,
  ],
  controllers: [
    DeviceController,
    DeviceDataController,
    DeviceCommandController,
    DeviceLogicController,
  ],
  providers: [
    DeviceDataService,
    DeviceCrudService,
    DeviceControlService,
    DeviceLogicCrudService,
    DeviceLogicService,
    MQTTHandlerService,
    DeviceRepository,
    DeviceDataRepository,
    DeviceLogicRepository,
  ],
})
export class DeviceModule {
  constructor(private readonly deviceControlService: DeviceControlService) {
    this.deviceControlService.startIpDefining();
    this.deviceControlService.subscribeToMQTT();
  }
}
