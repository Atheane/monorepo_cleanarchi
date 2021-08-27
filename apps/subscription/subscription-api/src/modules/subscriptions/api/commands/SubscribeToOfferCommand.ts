import { IsOptional, IsString } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';

export class SubscribeToOfferCommand {
  @Expose()
  @IsString()
  uid: string;

  @Expose()
  @IsOptional()
  offerId: string;

  static setProperties(cmd: SubscribeToOfferCommand): SubscribeToOfferCommand {
    return plainToClass(SubscribeToOfferCommand, cmd, { excludeExtraneousValues: true });
  }
}
