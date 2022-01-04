import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty()
  name: string;
}

export class UpdateLocationDto {
  @ApiProperty()
  name: string;
}
