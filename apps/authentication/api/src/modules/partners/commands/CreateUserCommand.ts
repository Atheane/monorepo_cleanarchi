import { IsEmail, IsOptional } from 'class-validator';

export class CreateUserCommand {
  @IsEmail()
  @IsOptional()
  email: string;
}
