import { plainToClass, Expose } from 'class-transformer';
import { IsNumber, IsOptional, ValidateNested, IsString, IsBoolean, IsEnum } from 'class-validator';
import { AlgoanEvents } from '@oney/algoan';

class AdenAnalysisCompletedSubscription {
  @Expose()
  @IsOptional()
  @IsBoolean()
  disableRecovery: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  status: string;

  @Expose()
  @IsOptional()
  @IsString()
  subscriberId: string;

  @Expose()
  @IsOptional()
  @IsString()
  target: string;

  @Expose()
  @IsEnum(AlgoanEvents)
  eventName: AlgoanEvents;

  @Expose()
  @IsOptional()
  @IsString()
  id: string;
}

class AdenAnalysisCompletedPayload {
  @Expose()
  @IsString()
  banksUserId: string;
}

export class CreditProfileCalculatedCommand {
  @Expose()
  @IsOptional()
  @IsNumber()
  index: number;

  @Expose()
  @ValidateNested({ each: true })
  subscription: AdenAnalysisCompletedSubscription;

  @Expose()
  @ValidateNested({ each: true })
  payload: AdenAnalysisCompletedPayload;

  @Expose()
  @IsOptional()
  @IsString()
  banksUserId: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  time: number;

  @Expose()
  @IsOptional()
  @IsString()
  id: string;

  static setProperties(cmd: CreditProfileCalculatedCommand): CreditProfileCalculatedCommand {
    return plainToClass(CreditProfileCalculatedCommand, cmd, { excludeExtraneousValues: true });
  }
}
