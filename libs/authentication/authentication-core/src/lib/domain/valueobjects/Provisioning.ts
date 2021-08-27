import { PublicProperties } from '@oney/common-core';
import { ProvisioningStep } from '../types/ProvisioningStep';

export type ProvisioningStepName = keyof Omit<PublicProperties<Provisioning>, 'partnerUid'>;

export interface ProvisioningStatus {
  success: boolean;
  date: Date;
}

export interface FromOptions {
  partnerUid: string;
  step: ProvisioningStep;
}

export class Provisioning {
  partnerUid: string;

  phone?: ProvisioningStatus;

  card?: ProvisioningStatus;

  civility?: ProvisioningStatus;

  pinAuth?: ProvisioningStatus;

  constructor(props: PublicProperties<Provisioning>) {
    Object.assign(this, props);
  }

  static from({ partnerUid, step }: FromOptions) {
    const props = { [step]: { success: true, date: new Date() }, partnerUid };
    return new Provisioning(props);
  }
}
