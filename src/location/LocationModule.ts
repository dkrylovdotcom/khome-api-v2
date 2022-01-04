import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationController } from './controllers/LocationController';
import { LocationService } from './services/LocationService';
import { LocationRepository } from './repositories/LocationRepository';
import { Location, LocationSchema } from './schemas/LocationSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
})
export class LocationModule {}
