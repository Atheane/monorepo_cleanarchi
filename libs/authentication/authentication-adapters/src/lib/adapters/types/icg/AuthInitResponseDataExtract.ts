import { AuthInitMethod } from '../../handlers/IcgRedirectHandler';

export type AuthInitResponseDataExtract = {
  responseId: string;
  validationUnitId: string;
  validationMethod: AuthInitMethod;
};
