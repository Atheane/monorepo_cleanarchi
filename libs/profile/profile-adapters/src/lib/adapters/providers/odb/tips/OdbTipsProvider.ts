import { Tips, TipsErrors } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { actionRequiredActivateTpl } from './templates/actionRequiredActivateTpl';
import { onHoldTpl } from './templates/onHoldTpl';
import { actionRequiredIdTpl } from './templates/actionRequiredIdTpl';
import { rejectedTpl } from './templates/rejectedTpl';
import { actionRequiredTaxNoticeTpl } from './templates/actionRequiredTaxNoticeTpl';

export class OdbTipsProvider {
  async render(uid: string, status: ProfileStatus): Promise<Tips> {
    const onHoldStatus = [
      ProfileStatus.ON_HOLD,
      ProfileStatus.ACTION_REQUIRED,
      ProfileStatus.CHECK_ELIGIBILITY,
      ProfileStatus.CHECK_REQUIRED_AML,
    ];
    if (onHoldStatus.includes(status)) {
      return onHoldTpl(uid);
    } else if (status === ProfileStatus.ACTION_REQUIRED_ID) {
      return actionRequiredIdTpl(uid);
    } else if (status === ProfileStatus.ACTION_REQUIRED_ACTIVATE) {
      return actionRequiredActivateTpl(uid);
    } else if (status === ProfileStatus.ACTION_REQUIRED_TAX_NOTICE) {
      return actionRequiredTaxNoticeTpl(uid);
    } else if (status === ProfileStatus.REJECTED) {
      return rejectedTpl(uid);
    }
    throw new TipsErrors.IfCaseNotImplemented('STATUS_NOT_HANDLE_YET');
  }
}
