import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty()
  @IsString()
  name: string;
}
