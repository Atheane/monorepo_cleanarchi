import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@oney/credit-messages';

export class GetPaymentScheduleQuery {
  @ApiProperty({
    example: 'IN_PROGRESS',
    description: 'list of status (IN_PROGRESS, CANCELED, CANCELED_PRE_CLEARING, PAID, PAID_ANTICIPATED)',
  })
  status: ContractStatus[];
}
