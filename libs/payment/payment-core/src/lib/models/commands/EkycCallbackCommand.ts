import { PublicProperties } from '@oney/common-core';
import { CallbackType } from '@oney/payment-messages';
import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested, validateOrReject } from 'class-validator';
import { DiligenceStatus } from '../../domain/types/DiligenceStatus';
import { DiligencesType } from '../../domain/types/DiligencesType';

class DiligencesCommand {
  @Expose()
  @IsString()
  @IsOptional()
  reason?: string;

  @Expose()
  @IsEnum(DiligencesType)
  type: DiligencesType;

  @Expose()
  @IsEnum(DiligenceStatus)
  status: DiligenceStatus;
}

export class EkycCallbackCommand {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  type: CallbackType;

  @Expose()
  @IsString()
  status: string;

  @Expose()
  @IsString()
  userId: string;

  @Expose()
  @ValidateNested()
  diligences: DiligencesCommand[];

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: PublicProperties<EkycCallbackCommand>): EkycCallbackCommand {
    return plainToClass(EkycCallbackCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
