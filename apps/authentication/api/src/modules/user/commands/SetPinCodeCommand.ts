import { IsString } from 'class-validator';

export class SetPinCodeCommand {
  @IsString()
  deviceId: string;

  @IsString()
  value: string;
}
