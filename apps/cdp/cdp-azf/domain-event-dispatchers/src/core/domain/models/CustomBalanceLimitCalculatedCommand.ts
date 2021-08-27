import { Expose, plainToClass } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString, validateOrReject } from 'class-validator';
import { CdpEventName } from '@oney/cdp-messages';
import { ICustomBalanceLimitCalculatedPayload } from '../types/ICustomBalanceLimitCalculatedPayload';

export class CustomBalanceLimitCalculatedCommand {
  @Expose()
  @IsString()
  uId: string;

  @Expose()
  @IsEnum(CdpEventName)
  title: CdpEventName;

  @Expose()
  @IsBoolean()
  eligibility: boolean;

  @Expose()
  @IsNumber()
  customBalanceLimit: number;

  @Expose()
  @IsNumber()
  verifiedRevenues: number;

  static setProperties(cmd: ICustomBalanceLimitCalculatedPayload): CustomBalanceLimitCalculatedCommand {
    return plainToClass(CustomBalanceLimitCalculatedCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
