import { AuthResponseReturnTypeCode } from './AuthResponseReturnTypeCode';

export interface ProvisioningErrorCauseUserProps {
  uid: string;
  email: string;
  phoneNumber?: string;
}

export interface ProvisioningErrorCause {
  msg: string;
  uid?: string;
  userProps: ProvisioningErrorCauseUserProps;
  responseCode: AuthResponseReturnTypeCode | string;
}
