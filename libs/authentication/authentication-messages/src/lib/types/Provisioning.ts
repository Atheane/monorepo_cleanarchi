import { ProvisioningStatus } from './ProvisioningStatus';

export interface Provisioning {
  partnerUid: string;
  phone?: ProvisioningStatus;
  card?: ProvisioningStatus;
  civility?: ProvisioningStatus;
  pinAuth?: ProvisioningStatus;
}
