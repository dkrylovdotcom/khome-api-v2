import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HttpResponse } from '../../core/helpers/HttpResponse';
import { AuthService } from '../services/AuthService';
import { UserManageService } from '../services/UserManageService';
import { CreateUserDto, AuthDto } from '../dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userManageService: UserManageService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Create User' })
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    const authPayload = await this.userManageService.create(createUserDto);
    return HttpResponse.successCreated({ authPayload });
  }

  @ApiOperation({ summary: 'Authorize User' })
  @Post('auth')
  public async auth(@Body() authDto: AuthDto) {
    const authPayload = await this.authService.auth(
      authDto.login,
      authDto.password,
    );
    return HttpResponse.successData({ authPayload });
  }
}
