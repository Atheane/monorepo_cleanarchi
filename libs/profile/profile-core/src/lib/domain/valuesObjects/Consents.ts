import { PublicProperties } from '@oney/common-core';
import { Consent } from '../types/Consent';

export class Consents {
  partners: Consent;
  oney: Consent;

  constructor(consent: PublicProperties<Consents>) {
    Object.assign(this, consent);
  }
}
