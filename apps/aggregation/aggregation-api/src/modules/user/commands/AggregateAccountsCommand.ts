import { BankAccountProperties } from '@oney/aggregation-core';
import { plainToClass, Type, Expose } from 'class-transformer';
import { IsString, ValidateNested, IsArray, IsDefined, IsBoolean, IsOptional } from 'class-validator';

export class BankAccountCommand implements Pick<BankAccountProperties, 'id' | 'name' | 'aggregated'> {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsOptional()
  name: string;

  @Expose()
  @IsBoolean()
  aggregated: boolean;
}

export class AggregateAccountsCommand {
  @Expose()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankAccountCommand)
  accounts: Pick<BankAccountProperties, 'id' | 'name' | 'aggregated'>[];

  /**
     * We set the property with classTransformer in order to choose
     what value we want to expose with the outside world and above all control what output value we received.
        */
  static setProperties(cmd: AggregateAccountsCommand): AggregateAccountsCommand {
    return plainToClass(AggregateAccountsCommand, cmd, { excludeExtraneousValues: true });
  }
}
