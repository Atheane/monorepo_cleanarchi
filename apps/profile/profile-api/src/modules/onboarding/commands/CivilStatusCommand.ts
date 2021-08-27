import { HonorificCode } from '@oney/profile-core';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';

export class CivilStatusCommand {
  @Expose()
  @IsEnum(HonorificCode)
  gender: HonorificCode;

  @Expose()
  @IsString()
  firstName: string;

  @Expose()
  @IsString()
  lastName: string;

  @Expose()
  @IsDateString()
  birthDate: Date;

  @Expose()
  @IsString()
  birthCity: string;

  @Expose()
  @IsString()
  birthCountry: string;

  @Expose()
  @IsString()
  @IsOptional()
  birthDepartmentCode: string;

  @Expose()
  @IsString()
  @IsOptional()
  birthDistrictCode: string;

  @Expose()
  @IsString()
  @IsOptional()
  nationality: string;

  @Expose()
  @IsString()
  @IsOptional()
  legalName: string;

  static setProperties(cmd: CivilStatusCommand): CivilStatusCommand {
    return plainToClass(CivilStatusCommand, cmd, { excludeExtraneousValues: true });
  }
}
