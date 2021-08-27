import { CallbackType } from '@oney/payment-messages';
import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsOptional, IsString, validateOrReject } from 'class-validator';
import { COPCallbackPayloadProperties } from '../../domain/valueobjects/callbacks/COPCallbackPayloadProperties';

export class COPCallbackCommand implements COPCallbackPayloadProperties {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  reference: string;

  @Expose()
  @IsEnum(CallbackType)
  type: CallbackType;

  @Expose()
  @IsString()
  transactionAmount: string;

  @Expose()
  @IsString()
  currencyCodeTransaction: string;

  @Expose()
  @IsOptional()
  @IsString()
  cardHolderBillingAmount?: string;

  @Expose()
  @IsOptional()
  @IsString()
  cardHolderBillingConversionRate?: string;

  @Expose()
  @IsString()
  availableBalance: string;

  @Expose()
  @IsOptional()
  @IsString()
  actionCode?: string;

  @Expose()
  @IsString()
  merchantType: string;

  @Expose()
  @IsString()
  cardAcceptorIdentificationCodeName: string;

  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  userId: string;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: COPCallbackPayloadProperties): COPCallbackCommand {
    return plainToClass(COPCallbackCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
