import { plainToClass, Expose } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class GetTermsCommand {
  @Expose()
  @IsString()
  @IsOptional()
  versionNumber: string;

  static setProperties(cmd: GetTermsCommand): GetTermsCommand {
    return plainToClass(GetTermsCommand, cmd, { excludeExtraneousValues: true });
  }
}
