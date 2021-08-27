import { PublicProperties } from '@oney/common-core';
import { CallbackType } from '@oney/payment-messages';
import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateOrReject } from 'class-validator';

export class SDDCallbackCommand {
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
  status: string;

  @Expose()
  @IsString()
  userid: string;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: PublicProperties<SDDCallbackCommand>): SDDCallbackCommand {
    return plainToClass(SDDCallbackCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
