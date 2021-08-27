import { Identity } from '@oney/identity-core';
import { Request } from 'express';

export interface UserRequest extends Request {
  user: Identity;
}
