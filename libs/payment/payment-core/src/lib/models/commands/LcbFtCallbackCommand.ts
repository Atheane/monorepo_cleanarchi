import { PublicProperties } from '@oney/common-core';
import { CallbackType } from '@oney/payment-messages';
import { Expose, plainToClass } from 'class-transformer';
import { IsDateString, IsEnum, IsString, validateOrReject } from 'class-validator';
import { LcbFtRiskLevel } from '../../domain/types/LcbFtRiskLevel';

export class LcbFtCallbackCommand {
  @Expose()
  @IsEnum(CallbackType)
  type: CallbackType;

  @Expose()
  @IsString()
  appUserId: string;

  @Expose()
  @IsEnum(LcbFtRiskLevel)
  riskLevel: LcbFtRiskLevel;

  @Expose()
  @IsDateString()
  eventDate: string;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: PublicProperties<LcbFtCallbackCommand>): LcbFtCallbackCommand {
    return plainToClass(LcbFtCallbackCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
