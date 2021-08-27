import { FacematchResult } from '@oney/profile-core';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class ValidateFacematchCommand {
  @IsNumber()
  @IsOptional()
  customerRank: number;

  @IsBoolean()
  @IsOptional()
  selfieConsent: boolean;

  @IsDateString()
  @IsOptional()
  selfieConsentDate: Date;

  @IsString()
  result: FacematchResult;

  @IsString()
  @IsOptional()
  msg: string;
}
