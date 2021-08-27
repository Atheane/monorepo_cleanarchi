import { Expose, plainToClass } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateProfileCommand {
  @Expose()
  @IsString()
  uid: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  @IsOptional()
  @IsPhoneNumber('fr')
  phone?: string;

  static setProperties(cmd: CreateProfileCommand): CreateProfileCommand {
    return plainToClass(CreateProfileCommand, cmd, { excludeExtraneousValues: true });
  }
}
