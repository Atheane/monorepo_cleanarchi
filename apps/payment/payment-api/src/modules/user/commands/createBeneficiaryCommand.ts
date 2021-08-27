import { Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateBeneficiaryCommand {
  @Expose()
  @IsString()
  bic: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  iban: string;

  static setProperties(cmd: CreateBeneficiaryCommand): CreateBeneficiaryCommand {
    return plainToClass(CreateBeneficiaryCommand, cmd, { excludeExtraneousValues: true });
  }
}
