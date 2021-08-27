import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class VerifyBankAccountOwnerCommand {
  @Expose()
  @IsString()
  @IsOptional()
  identity?: string;

  @Expose()
  @IsString()
  @IsOptional()
  lastName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  firstName?: string;

  @Expose()
  @IsString()
  @IsOptional()
  birthDate?: string;

  @Expose()
  @IsString()
  bankName: string;

  static setProperties(cmd: VerifyBankAccountOwnerCommand): VerifyBankAccountOwnerCommand {
    return plainToClass(VerifyBankAccountOwnerCommand, cmd, { excludeExtraneousValues: true });
  }
}
