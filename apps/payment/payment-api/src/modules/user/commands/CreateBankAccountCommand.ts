import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class CreateBankAccountCommand {
  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsString()
  country: string;

  @Expose()
  @IsString()
  street: string;

  @Expose()
  @IsString()
  @IsOptional()
  additionalStreet?: string;

  @Expose()
  @IsString()
  zipCode: string;

  static setProperties(cmd: CreateBankAccountCommand): CreateBankAccountCommand {
    return plainToClass(CreateBankAccountCommand, cmd, { excludeExtraneousValues: true });
  }
}
