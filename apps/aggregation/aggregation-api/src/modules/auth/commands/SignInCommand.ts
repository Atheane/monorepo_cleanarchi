import { ISigninField } from '@oney/aggregation-core';
import { plainToClass, Type, Expose } from 'class-transformer';
import { IsOptional, IsString, ValidateNested, IsArray, IsDefined } from 'class-validator';
import { SigninField } from '../dto';

export class SignInCommand {
  @Expose()
  @IsDefined()
  @IsString()
  bankId: string;

  @Expose()
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SigninField)
  form: ISigninField[];

  @IsOptional()
  @IsString()
  userId: string;

  /**
     * We set the property with classTransformer in order to choose
     what value we want to expose with the outside world and above all control what output value we received.
        */
  static setProperties(cmd: SignInCommand): SignInCommand {
    return plainToClass(SignInCommand, cmd, { excludeExtraneousValues: true });
  }
}
