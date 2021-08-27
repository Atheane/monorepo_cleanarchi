import { InnerResponseStatus } from './InnerResponseStatus';

export type AuthInnerResponse<SecurityAssertion> = SecurityAssertion & {
  status: InnerResponseStatus;
  notifications?: string[];
  unlockingDate?: string;
};
