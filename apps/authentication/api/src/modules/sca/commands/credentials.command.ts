import { IsString } from 'class-validator';

export class CredentialsCommand {
  @IsString()
  credentials: string;
}
