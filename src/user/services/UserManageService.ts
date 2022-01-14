import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/UserSchema';
import { UserRepository } from '../repositories/UserRepository';
import { CreateUserDto } from '../dto';

@Injectable()
export class UserManageService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userRepository: UserRepository,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const { login, name, password } = createUserDto;
    const hash = await argon2.hash(password);
    const user = new this.userModel({
      login,
      name,
      passwordHash: hash,
    });
    await this.userRepository.save(user);
    return user;
  }
}
