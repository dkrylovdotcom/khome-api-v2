import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { LocationModule } from './location/LocationModule';
import { DeviceModule } from './device/DeviceModule';
import { UserModule } from './user/UserModule';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: false,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get('DB_CONNECTION_URI'),
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    ScheduleModule.forRoot(),
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
