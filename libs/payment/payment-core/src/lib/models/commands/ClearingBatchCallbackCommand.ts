import { CallbackType } from '@oney/payment-messages';
import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateOrReject } from 'class-validator';
import { ClearingBatchCallbackPayloadProperties } from '../../domain/valueobjects/callbacks/ClearingBatchCallbackPayloadProperties';

export class ClearingBatchCallbackCommand implements ClearingBatchCallbackPayloadProperties {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  reference: string;

  @Expose()
  @IsEnum(CallbackType)
  type: CallbackType;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: ClearingBatchCallbackPayloadProperties): ClearingBatchCallbackCommand {
    return plainToClass(ClearingBatchCallbackCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
