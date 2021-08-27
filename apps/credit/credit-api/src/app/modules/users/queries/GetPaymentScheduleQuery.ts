import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetPaymentScheduleQuery {
  @IsString()
  @ApiProperty({ example: '1380', description: 'Bank account id (SMoney id)' })
  bankAccountId: string;

  @IsString()
  @ApiProperty({
    example: '73RHCQLfy',
    description: 'Contract number for the 3x or 4x product',
  })
  contractNumber: string;
}
