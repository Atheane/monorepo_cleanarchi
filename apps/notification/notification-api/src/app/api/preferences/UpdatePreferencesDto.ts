import { Expose, plainToClass } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdatePreferencesDto {
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  allowAccountNotifications: boolean;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  allowTransactionNotifications: boolean;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
   */
  static setProperties(cmd: UpdatePreferencesDto): UpdatePreferencesDto {
    return plainToClass(UpdatePreferencesDto, cmd, { excludeExtraneousValues: true });
  }
}
