import { Expose, plainToClass } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateConsentsCommand {
  @Expose()
  @IsBoolean()
  @IsOptional()
  oney_len?: boolean;

  @Expose()
  @IsBoolean()
  oney_cnil: boolean;

  @Expose()
  @IsBoolean()
  @IsOptional()
  partners_len?: boolean;

  @Expose()
  @IsBoolean()
  partners_cnil?: boolean;

  static setProperties(cmd: UpdateConsentsCommand): UpdateConsentsCommand {
    return plainToClass(UpdateConsentsCommand, cmd, { excludeExtraneousValues: true });
  }
}
