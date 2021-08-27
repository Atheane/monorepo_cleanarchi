import { ApiProperty } from '@nestjs/swagger';

export class UserIdParams {
  @ApiProperty({ example: 'dTiBfDrmg', description: 'ODB userId' })
  userId: string;
}

export class UserAndAccountParams {
  @ApiProperty({ example: 'dTiBfDrmg', description: 'ODB userId' })
  userId: string;

  @ApiProperty({ example: '7530', description: 'SMoney or Budget Insight Account id' })
  accountId: string;
}

export class UserAndTransactionParams {
  @ApiProperty({ example: 'dTiBfDrmg', description: 'ODB userId' })
  userId: string;

  @ApiProperty({ example: 'a-9F3q0Ov', description: 'Budget Insight Account id' })
  transactionId: string;
}

export class UserAndAccountStatementParams {
  @ApiProperty({ example: 'dTiBfDrmg', description: 'ODB userId' })
  userId: string;

  @ApiProperty({ example: 'eWRhpRV', description: 'Account statement Id' })
  accountStatementId: string;
}
