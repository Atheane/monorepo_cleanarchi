import { CdpEventName } from '@oney/cdp-messages';
import { CdpEventError } from '../models/CdpEventError';
import { ICdpEligibilityPayload } from '../types/ICdpEligibilityPayload';

export class ValidCdpEventName {
  constructor(private cdpPayload: ICdpEligibilityPayload) {
    if (!this.cdpPayload.title) {
      throw new CdpEventError.MissingEventName();
    }
    if (!CdpEventName[this.cdpPayload.title]) {
      throw new CdpEventError.EventNotImplemented();
    }
  }

  get value(): ICdpEligibilityPayload {
    return this.cdpPayload;
  }
}
