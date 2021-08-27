import { Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

export class DisplayCardPinCommand {
  @Expose()
  @IsString()
  rsaPublicKey: string;

  static setProperties(cmd: DisplayCardPinCommand): DisplayCardPinCommand {
    return plainToClass(DisplayCardPinCommand, cmd, { excludeExtraneousValues: true });
  }
}
