import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Location, LocationDocument } from '../schemas/LocationSchema';
import { LocationRepository } from '../repositories/LocationRepository';
import { CreateLocationDto, UpdateLocationDto } from '../dto/LocationDto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<LocationDocument>,
    private readonly locationRepository: LocationRepository,
  ) {}

  public async create(createLocationDto: CreateLocationDto) {
    const item = new this.locationModel(createLocationDto);
    await this.locationRepository.save(item);
  }

  public async update(id: string, updateLocationDto: UpdateLocationDto) {
    const item = await this.locationRepository.get(id);
    item.name = updateLocationDto.name;
    await this.locationRepository.save(item);
  }

  public async remove(id: string) {
    await this.locationRepository.remove(id);
  }
}
