import { PublicProperties } from '@oney/common-core';

export class Eligibility {
  accountEligibility: boolean;

  constructor(eligibility: PublicProperties<Eligibility>) {
    Object.assign(this, eligibility);
  }
}
