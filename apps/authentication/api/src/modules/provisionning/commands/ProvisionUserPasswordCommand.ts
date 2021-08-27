import { IsString, Length } from 'class-validator';

export class ProvisionUserPasswordCommand {
  @IsString()
  @Length(6, 6)
  password: string;
}
