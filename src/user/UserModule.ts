import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controlllers/UserController';
import { AuthService, UserManageService } from './services';
import { UserRepository } from './repositories/UserRepository';
import { User, UserSchema } from './schemas/UserSchema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [AuthService, UserManageService, UserRepository],
})
export class UserModule {}
