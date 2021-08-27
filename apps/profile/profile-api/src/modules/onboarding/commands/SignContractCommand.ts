import { Expose, plainToClass } from 'class-transformer';
import { IsDateString } from 'class-validator';

export class SignContractCommand {
  @Expose()
  @IsDateString()
  date: Date;

  static setProperties(cmd: SignContractCommand): SignContractCommand {
    return plainToClass(SignContractCommand, cmd, { excludeExtraneousValues: true });
  }
}
