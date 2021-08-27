import { Expose, plainToClass } from 'class-transformer';
import { IsString } from 'class-validator';

export class CardHmacCommand {
  @Expose()
  @IsString()
  rsaPublicKey: string;

  @Expose()
  @IsString()
  hmacData: string;

  static setProperties(cmd: CardHmacCommand): CardHmacCommand {
    return plainToClass(CardHmacCommand, cmd, { excludeExtraneousValues: true });
  }
}
