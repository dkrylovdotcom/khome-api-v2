import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  name: string;
}
