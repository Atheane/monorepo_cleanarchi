import { Expose, plainToClass, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
  validateOrReject,
} from 'class-validator';
import { CdpEventName } from '@oney/cdp-messages';
import { ICustomBalanceLimitCalculatedPayload } from '../types/ICustomBalanceLimitCalculatedPayload';
import { AccountIncomeVerification } from '../types/IAggregatedAccountsIncomesCheckedPayload';

class AccountIncomeVerificationFields {
  @Expose()
  @IsNumber()
  accountAggregatedId: number;

  @Expose()
  @IsBoolean()
  valid: boolean;
}

export class AggregatedAccountsIncomesCheckedCommand {
  @Expose()
  @IsString()
  uId: string;

  @Expose()
  @IsEnum(CdpEventName)
  title: CdpEventName;

  @Expose()
  @IsString()
  timestamp: string;

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccountIncomeVerificationFields)
  possibleRevenuesDetected: AccountIncomeVerification[];

  static setProperties(cmd: ICustomBalanceLimitCalculatedPayload): AggregatedAccountsIncomesCheckedCommand {
    return plainToClass(AggregatedAccountsIncomesCheckedCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
