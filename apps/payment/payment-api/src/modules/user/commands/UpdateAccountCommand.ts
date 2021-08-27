import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { DeclarativeFiscalSituation, FiscalReference } from '@oney/profile-messages';

export class UpdateAccountCommand {
  @Expose()
  @IsOptional()
  @IsString()
  phone?: string;

  @Expose()
  @ValidateNested()
  fiscalReference: FiscalReference;

  @Expose()
  @ValidateNested()
  declarativeFiscalSituation?: DeclarativeFiscalSituation;

  static setProperties(cmd: UpdateAccountCommand): UpdateAccountCommand {
    return plainToClass(UpdateAccountCommand, cmd, { excludeExtraneousValues: true });
  }
}
