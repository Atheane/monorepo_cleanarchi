import { Expose, plainToClass } from 'class-transformer';
import { IsMobilePhone, IsString } from 'class-validator';

export class GenerateOtpCommand {
  @Expose()
  @IsString()
  @IsMobilePhone()
  phone: string;

  static setProperties(cmd: GenerateOtpCommand): GenerateOtpCommand {
    return plainToClass(GenerateOtpCommand, cmd, { excludeExtraneousValues: true });
  }
}
