import { IsEmail } from 'class-validator';

export class SignInCommand {
  @IsEmail()
  email: string;
}
