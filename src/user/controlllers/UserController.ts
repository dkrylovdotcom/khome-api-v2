import { Body, Controller, Post } from '@nestjs/common';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { AuthService } from '../services/AuthService';
import { UserManageService } from '../services/UserManageService';
import { CreateUserDto, AuthDto } from '../dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userManageService: UserManageService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const authPayload = await this.userManageService.create(createUserDto);
    return HttpResponse.successCreated({ authPayload });
  }

  @Post('auth')
  public async auth(@Body() authDto: AuthDto) {
    const authPayload = await this.authService.auth(
      authDto.login,
      authDto.password,
    );
    return HttpResponse.successData({ authPayload });
  }
}
