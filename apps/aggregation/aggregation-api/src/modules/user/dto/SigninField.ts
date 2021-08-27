import { ISigninField } from '@oney/aggregation-core';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class SigninField implements ISigninField {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  value: string;
}
