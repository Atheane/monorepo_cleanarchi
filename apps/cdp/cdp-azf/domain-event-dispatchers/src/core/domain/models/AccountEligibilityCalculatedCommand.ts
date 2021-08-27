import { Expose, plainToClass } from 'class-transformer';
import { IsBoolean, IsEnum, IsString, validateOrReject, IsNumber, IsOptional } from 'class-validator';
import { CdpEventName } from '@oney/cdp-messages';
import { IAccountEligibilityCalculatedPayload } from '../types';

export class AccountEligibilityCalculatedCommand {
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
  @IsString()
  timestamp: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  balanceLimit: number;

  static setProperties(cmd: IAccountEligibilityCalculatedPayload): AccountEligibilityCalculatedCommand {
    return plainToClass(AccountEligibilityCalculatedCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
