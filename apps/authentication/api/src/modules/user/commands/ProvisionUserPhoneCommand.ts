import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ProvisionUserPhoneCommand {
  @IsString()
  phone: string;

  @IsBoolean()
  @IsOptional()
  useIcgSmsAuthFactor: boolean;
}
