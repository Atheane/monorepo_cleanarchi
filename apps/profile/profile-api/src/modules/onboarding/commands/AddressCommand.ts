import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AddressCommand {
  @Expose()
  @IsString()
  street: string;

  @Expose()
  @IsString()
  @IsOptional()
  additionalStreet?: string;

  @Expose()
  @IsString()
  postalCode: string;

  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsString()
  country: string;

  static setProperties(cmd: AddressCommand): AddressCommand {
    return plainToClass(AddressCommand, cmd, { excludeExtraneousValues: true });
  }
}
