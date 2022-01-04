import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  password: string;
}