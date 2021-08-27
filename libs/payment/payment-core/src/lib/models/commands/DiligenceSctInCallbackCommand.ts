import { CallbackType } from '@oney/payment-messages';
import { Expose, plainToClass } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsString, validateOrReject } from 'class-validator';
import { PublicProperties } from '@oney/common-core';
import { DiligenceStatus } from '../../domain/types/DiligenceStatus';
import { DiligencesType } from '../../domain/types/DiligencesType';

export class DiligenceSctInCallbackCommand {
  @Expose()
  @IsEnum(CallbackType)
  type: CallbackType;

  @Expose()
  @IsEnum(DiligenceStatus)
  status: DiligenceStatus;

  @Expose()
  @IsString()
  appUserId: string;

  @Expose()
  @IsEnum(DiligencesType)
  diligenceType: DiligencesType;

  @Expose()
  @IsNumber()
  amount: number;

  @Expose()
  @IsDateString()
  transferDate: Date;

  @Expose()
  @IsString()
  transmitterFullname: string;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: PublicProperties<DiligenceSctInCallbackCommand>): DiligenceSctInCallbackCommand {
    return plainToClass(DiligenceSctInCallbackCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
