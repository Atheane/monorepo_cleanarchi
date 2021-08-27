import { plainToClass, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { GetTopicsCommand as GetTopicsCommandUsecase } from '@oney/profile-core';

export class GetTopicsCommand implements GetTopicsCommandUsecase {
  @Expose()
  @IsString()
  @IsOptional()
  versionNumber: string;

  static setProperties(cmd: GetTopicsCommand): GetTopicsCommand {
    return plainToClass(GetTopicsCommand, cmd, { excludeExtraneousValues: true });
  }
}
