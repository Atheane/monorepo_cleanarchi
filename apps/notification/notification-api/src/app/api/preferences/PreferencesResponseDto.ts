import { Expose, plainToClass } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PreferencesResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  allowAccountNotifications: boolean;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  allowTransactionNotifications: boolean;

  @Expose()
  @IsNotEmpty()
  @IsString()
  uid: string;

  static setProperties(cmd: PreferencesResponseDto): PreferencesResponseDto {
    return plainToClass(PreferencesResponseDto, cmd, { excludeExtraneousValues: true });
  }
}
