import { Expose, plainToClass } from 'class-transformer';
import { IsEnum, IsString, validateOrReject } from 'class-validator';
import { CdpEventName } from '@oney/cdp-messages';
import { IPreEligibilityOKPayload } from '../types';

export class PreEligibilityOKCommand {
  @Expose()
  @IsString()
  uId: string;

  @Expose()
  @IsEnum(CdpEventName)
  title: CdpEventName;

  @Expose()
  @IsString()
  timestamp: string;

  static setProperties(cmd: IPreEligibilityOKPayload): PreEligibilityOKCommand {
    return plainToClass(PreEligibilityOKCommand, cmd, { excludeExtraneousValues: true });
  }

  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
