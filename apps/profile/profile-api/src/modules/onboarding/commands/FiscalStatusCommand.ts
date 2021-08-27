import { DeclarativeFiscalSituation, FiscalReference } from '@oney/profile-core';
import { Expose, plainToClass } from 'class-transformer';
import { ValidateNested, IsObject } from 'class-validator';

export class FiscalStatusCommand {
  @Expose()
  @IsObject()
  @ValidateNested()
  fiscalReference: FiscalReference;

  @Expose()
  @IsObject()
  @ValidateNested()
  declarativeFiscalSituation: DeclarativeFiscalSituation;

  static setProperties(cmd: FiscalStatusCommand): FiscalStatusCommand {
    return plainToClass(FiscalStatusCommand, cmd, { excludeExtraneousValues: true });
  }
}
