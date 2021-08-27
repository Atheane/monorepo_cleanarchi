import { ApiProperty } from '@nestjs/swagger';
import { SplitProduct } from '@oney/credit-messages';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SimulatesSplitCommand {
  @IsEnum(SplitProduct, { each: true })
  @ApiProperty({ example: ['DF003'], description: 'Identifier of the loan product', enum: SplitProduct })
  productsCode: SplitProduct[];

  @IsNumber()
  @Min(1, {
    message: 'The amount to split has to be at least 1',
  })
  @ApiProperty({ example: 1500, description: 'Amount of the loan in full unit' })
  amount: number;

  @IsString()
  @ApiProperty({ example: 'a-9F3q0Ov', description: 'Transaction id (SMoney id)' })
  initialTransactionId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '2021-01-06T13:46:08.357Z', description: 'Transaction date' })
  transactionDate: Date;

  @IsString()
  @ApiProperty({ example: 'merchant name', description: 'Merchant name' })
  label: string;
}
