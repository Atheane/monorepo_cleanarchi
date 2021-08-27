import { Expose, plainToClass } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCardCommand {
  @Expose()
  @IsOptional()
  @IsBoolean()
  blocked: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  foreignPayment: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  internetPayment: boolean;

  @Expose()
  @IsOptional()
  @IsBoolean()
  hasPin: boolean;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  atmWeeklyAllowance: number;

  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  monthlyAllowance: number;

  static setProperties(cmd: UpdateCardCommand): UpdateCardCommand {
    return plainToClass(UpdateCardCommand, cmd, { excludeExtraneousValues: true });
  }
}
