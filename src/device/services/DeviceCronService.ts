import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { DeviceRepository } from '../repositories/DeviceRepository';

Injectable();
export class DeviceCronService implements OnModuleInit {
  private readonly logger = new Logger(DeviceCronService.name);

  constructor(
    @Inject(DeviceRepository)
    private readonly deviceRepository: DeviceRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit() {
    this.startCronForAll();
  }

  public async startCronForAll() {
    const devices = await this.deviceRepository.getAll();
    for (const device of devices) {
      if (device.cron) {
        this.addCronJob(
          device.deviceId,
          device.cron.timePattern,
          device.cron.function,
        );
      }
    }
  }

  private addCronJob(name: string, timePattern: string, func: any) {
    const job = new CronJob(timePattern, () => {
      this.logger.log(`time for job ${name} to run!`);
      func();
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.log(`job ${name} added for timePattern ${timePattern}!`);
  }
}
