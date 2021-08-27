import {
  BudgetInsightBankConnection,
  BIUser,
  BudgetInsightConnectionState,
} from '@oney/aggregation-adapters';
import { plainToClass, Expose } from 'class-transformer';
import { IsOptional, ValidateNested, IsNumber, IsBoolean, IsEnum, IsDate } from 'class-validator';

class BudgetInsightBankConnectionType implements BudgetInsightBankConnection {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsEnum(BudgetInsightConnectionState)
  state: BudgetInsightConnectionState;

  @Expose()
  @IsBoolean()
  active: boolean;

  @Expose()
  @IsOptional()
  @IsNumber()
  id_user: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  id_connector: number;

  @Expose()
  @IsOptional()
  @IsDate()
  last_update: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  created: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  last_push: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  next_try: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  connector_uuid: string;
}

export class ConnectionSyncCommand {
  @Expose()
  @ValidateNested({ each: true })
  connection: BudgetInsightBankConnectionType;

  @Expose()
  @IsOptional()
  user: BIUser;

  static setProperties(cmd: ConnectionSyncCommand): ConnectionSyncCommand {
    return plainToClass(ConnectionSyncCommand, cmd, { excludeExtraneousValues: true });
  }
}
