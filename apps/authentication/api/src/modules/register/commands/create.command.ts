import { IsEmail, IsPhoneNumber, IsString, ValidateIf } from 'class-validator';

export class CreateCommand {
  @ValidateIf((instance: CreateCommand) => !instance.phone || (!!instance.phone && !!instance.email))
  @IsEmail()
  email: string;

  @ValidateIf((instance: CreateCommand) => !instance.email || (!!instance.phone && !!instance.email))
  @IsPhoneNumber('fr')
  @IsString()
  phone: string;
}
