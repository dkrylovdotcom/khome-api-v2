import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/UserSchema';

Injectable();
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async getAll(): Promise<UserDocument[]> {
    return await this.userModel.find({});
  }

  public async get(id: string): Promise<UserDocument> {
    const item = await this.userModel.findById({ id });
    if (!item) throw new Error('User not found');
    return item;
  }

  public async getByLogin(login: string): Promise<UserDocument> {
    const item = await this.userModel.findOne({ login });
    if (!item) throw new Error('User not found');
    return item;
  }

  public async save(user: UserDocument) {
    await user.save();
  }

  public async remove(user: UserDocument) {
    await user.remove();
  }
}
