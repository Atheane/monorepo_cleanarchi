import { Recurrency } from '@oney/payment-core';
import { plainToClass, Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { IsAmountValid } from '../../common/validators';

export class ProcessPaymentCommand {
  @Expose()
  @IsNumber()
  ref!: number;

  @Expose()
  @IsNumber()
  @IsAmountValid()
  amount!: number;

  @Expose()
  @IsString()
  @IsOptional()
  contractNumber!: string;

  @Expose()
  @IsString()
  message!: string;

  @Expose()
  @IsString()
  @IsOptional()
  beneficiaryId: string;

  @Expose()
  @IsString()
  senderId: string;

  @Expose()
  @ValidateNested()
  recurency: Recurrency;

  @Expose()
  @IsOptional()
  @IsString()
  orderId: string;

  /**
     * We set the property with classTransformer in order to choose
     what value we want to expose with the outside world and above all control what output value we received.
     */
  static setProperties(cmd: ProcessPaymentCommand): ProcessPaymentCommand {
    if (cmd.beneficiaryId == null) {
      cmd = {
        ...cmd,
        beneficiaryId: null,
      };
    }
    return plainToClass(ProcessPaymentCommand, cmd, { excludeExtraneousValues: true });
  }
}
