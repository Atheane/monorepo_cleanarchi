import { TransferFrequencyType } from '@oney/payment-core';
import { Expose, plainToClass } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { IsAmountValid } from '../../common/validators';

export class TransferCommand {
  @Expose()
  @IsEnum(TransferFrequencyType)
  @IsOptional()
  @ValidateIf(v => v.recurrentEndDate != null)
  frequencyType: number;

  @Expose()
  @IsDateString()
  @IsOptional()
  @ValidateIf(v => v.frequencyType != null)
  recurrentEndDate: Date;

  @Expose()
  @IsDateString()
  @IsOptional()
  executionDate: Date;

  @Expose()
  @IsString()
  bankAccountId: string;

  @Expose()
  @IsNumber()
  @IsAmountValid()
  amount: number;

  @Expose()
  @IsString()
  @MaxLength(140)
  message: string;

  @Expose()
  @IsString()
  @MaxLength(140)
  motif: string;

  @Expose()
  @IsEmail()
  @IsOptional()
  recipientEmail: string;

  static setProperties(cmd: TransferCommand): TransferCommand {
    return plainToClass(TransferCommand, cmd, { excludeExtraneousValues: true });
  }
}
