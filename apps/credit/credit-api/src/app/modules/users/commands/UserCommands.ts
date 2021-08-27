import { ApiProperty } from '@nestjs/swagger';

export class UserIdParams {
  @ApiProperty({ example: 'dTiBfDrmg', description: 'ODB userId' })
  userId: string;
}
