import { Expose, plainToClass } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { CardType } from '@oney/payment-messages';

export class CreateCardCommand {
  @Expose()
  @IsEnum(CardType)
  cardType: CardType;

  static setProperties(cmd: CreateCardCommand): CreateCardCommand {
    return plainToClass(CreateCardCommand, cmd, { excludeExtraneousValues: true });
  }
}
