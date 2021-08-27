import { Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

export class DisplayCardDetailsCommand {
  @Expose()
  @IsString()
  rsaPublicKey: string;

  static setProperties(cmd: DisplayCardDetailsCommand): DisplayCardDetailsCommand {
    return plainToClass(DisplayCardDetailsCommand, cmd, { excludeExtraneousValues: true });
  }
}
