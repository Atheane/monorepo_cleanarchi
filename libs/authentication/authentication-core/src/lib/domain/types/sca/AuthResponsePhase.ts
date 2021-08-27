import { InnerResponseStatus } from './InnerResponseStatus';

export interface AuthResponsePhase {
  state: string;
  retryCounter: number;
  fallbackFactorAvailable: boolean;
  previousResult?: InnerResponseStatus;
  securityLevel: string;
  notifications?: string[];
}
