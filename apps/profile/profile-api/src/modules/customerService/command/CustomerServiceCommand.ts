import { plainToClass, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { SendDemandToCustomerServiceCommand } from '@oney/profile-core';

export class CustomerServiceCommand implements SendDemandToCustomerServiceCommand {
  @Expose()
  @IsString()
  firstname: string;

  @Expose()
  @IsString()
  lastname: string;

  @Expose()
  @IsString()
  @IsOptional()
  birthname?: string;

  @Expose()
  @IsString()
  email: string;

  @Expose()
  @IsString()
  phone: string;

  @Expose()
  @IsString()
  gender: string;

  @Expose()
  @IsString()
  @IsOptional()
  userId?: string;

  @Expose()
  @IsString()
  topic: string;

  @Expose()
  @IsString()
  demand: string;

  /**
   * We set the property with classTransformer in order to choose
   what value we want to expose with the outside world and above all control what output value we received.
      */
  static setProperties(cmd: CustomerServiceCommand): CustomerServiceCommand {
    return plainToClass(CustomerServiceCommand, cmd, { excludeExtraneousValues: true });
  }
}
