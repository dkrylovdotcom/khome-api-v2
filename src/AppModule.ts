import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import * as config from 'config';
import { LocationModule } from './location/LocationModule';
import { DeviceModule } from './device/DeviceModule';
import { UserModule } from './user/UserModule';
import { CoreModule } from './core/CoreModule';

const { url: dbUrl } = config.get('db');

@Module({
  imports: [
    MongooseModule.forRoot(dbUrl),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    CoreModule,
    UserModule,
    LocationModule,
    DeviceModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
