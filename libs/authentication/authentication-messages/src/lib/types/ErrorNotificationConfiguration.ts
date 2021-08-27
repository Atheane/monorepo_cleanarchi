import { ProvisioningErrorCause } from './ProvisioningErrorCause';
import { ProvisioningStep } from './ProvisioningStep';

export interface ErrorNotificationConfiguration {
  uid: string;
  step: ProvisioningStep;
  email: string;
  recipient: string;
  name: string;
  message: string;
  cause: ProvisioningErrorCause;
  authBaseUrl: string;
  responseCode?: string;
}
