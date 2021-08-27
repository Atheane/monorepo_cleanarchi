import { Action } from '@oney/authentication-core';
import { IsBoolean, IsOptional } from 'class-validator';

export class RequestAuthCommand {
  action: Action;

  @IsOptional()
  @IsBoolean()
  shouldByPassPinCode?: boolean;
}
