import { Injectable, Inject } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { UserDocument } from '../schemas/UserSchema';

const { webServer } = config.get('app');

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  public async auth(login: string, password: string) {
    const user = await this.userRepository.getByLogin(login);
    if (await argon2.verify(user.passwordHash, password)) {
      user.lastLogin = new Date();
      this.userRepository.save(user);

      return {
        login: user.login,
        name: user.name,
        token: this.generateToken(user),
      };
    }
    throw new Error('User auth failed');
  }

  private generateToken(user: UserDocument) {
    const data = {
      _id: user._id,
      name: user.name,
      login: user.login,
    };
    return jwt.sign({ data }, webServer.jwt.signature, {
      expiresIn: webServer.jwt.expiration,
    });
  }
}
