import { AuthResponsePayload } from '@oney/authentication-core';
import { SamlResponse } from './SamlResponse';

export interface AuthInitResultMapperInput {
  result: AuthResponsePayload<SamlResponse>;
  uid: string;
}
