import { AuthRequestValidationMethod } from '@oney/authentication-core';
import { AuthInitDto } from './AuthInitDto';

export type VerifyRequestPayloadConfig = {
  data: Pick<AuthInitDto<AuthRequestValidationMethod>, 'id' | 'method'>;
  credential?: string;
};
