import { Identity } from '@oney/identity-core';
import { Request } from 'express';

export interface AuthentifiedRequest extends Request {
  user: Identity;
}
