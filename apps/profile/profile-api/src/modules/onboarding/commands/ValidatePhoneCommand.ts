import { Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

export class ValidatePhoneCommand {
  @Expose()
  @IsString()
  code: string;

  static setProperties(cmd: ValidatePhoneCommand): ValidatePhoneCommand {
    return plainToClass(ValidatePhoneCommand, cmd, { excludeExtraneousValues: true });
  }
}
