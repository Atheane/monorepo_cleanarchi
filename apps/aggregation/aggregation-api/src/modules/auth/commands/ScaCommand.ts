import { ISigninField } from '@oney/aggregation-core';
import { plainToClass, Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
import { SigninField } from '../dto';

export class ScaCommand {
  @Expose()
  @IsString()
  connectionId: string;

  @Expose()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SigninField)
  form: ISigninField[];

  @Expose()
  @IsOptional()
  @IsString()
  userId: string;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
      */
  static setProperties(cmd: ScaCommand): ScaCommand {
    return plainToClass(ScaCommand, cmd, { excludeExtraneousValues: true });
  }
}
