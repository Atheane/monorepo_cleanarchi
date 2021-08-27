import { ISigninField } from '@oney/aggregation-core';
import { plainToClass, Type, Expose } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { SigninField } from '../dto';

export class UpdateConnectionCommand {
  @Expose()
  @IsOptional()
  @IsString()
  bankId: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SigninField)
  form: ISigninField[];

  /**
     * We set the property with classTransformer in order to choose
     what value we want to expose with the outside world and above all control what output value we received.
        */
  static setProperties(cmd: UpdateConnectionCommand): UpdateConnectionCommand {
    return plainToClass(UpdateConnectionCommand, cmd, { excludeExtraneousValues: true });
  }
}
