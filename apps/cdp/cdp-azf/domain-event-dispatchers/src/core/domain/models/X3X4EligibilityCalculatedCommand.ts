import { Expose, plainToClass } from 'class-transformer';
import { IsBoolean, IsEnum, IsString, validateOrReject } from 'class-validator';
import { CdpEventName } from '@oney/cdp-messages';
import { IX3X4EligibilityCalculatedPayload } from '../types/IX3X4EligibilityCalculatedPayload';

export class X3X4EligibilityCalculatedCommand {
  @Expose()
  @IsString()
  uId: string;

  @Expose()
  @IsEnum(CdpEventName)
  title: CdpEventName;

  @Expose()
  @IsBoolean()
  eligibility: boolean;

  static setProperties(cmd: IX3X4EligibilityCalculatedPayload): X3X4EligibilityCalculatedCommand {
    return plainToClass(X3X4EligibilityCalculatedCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
