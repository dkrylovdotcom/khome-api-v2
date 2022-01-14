import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  login: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;
}
