import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './controllers/DeviceController';
import { DeviceDataController } from './controllers/DeviceDataController';
import { DeviceCommandController } from './controllers/DeviceCommandController';
import {
  DeviceDataService,
  DeviceCrudService,
  DeviceControlService,
  MQTTHandlerService,
} from './services';
import { DeviceRepository } from './repositories/DeviceRepository';
import { DeviceDataRepository } from './repositories/DeviceDataRepository';
import { Device, DeviceSchema } from './schemas/DeviceSchema';
import { DeviceData, DeviceDataSchema } from './schemas/DeviceDataSchema';
import { CoreModule } from '../core/CoreModule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: DeviceData.name, schema: DeviceDataSchema },
    ]),
    CoreModule,
  ],
  controllers: [
    DeviceController,
    DeviceDataController,
    DeviceCommandController,
  ],
  providers: [
    DeviceDataService,
    DeviceCrudService,
    DeviceControlService,
    MQTTHandlerService,
    DeviceRepository,
    DeviceDataRepository,
  ],
})
export class DeviceModule {
  constructor(private readonly deviceControlService: DeviceControlService) {
    this.deviceControlService.startIpDefining();
    this.deviceControlService.subscribeToMQTT();
  }
}
