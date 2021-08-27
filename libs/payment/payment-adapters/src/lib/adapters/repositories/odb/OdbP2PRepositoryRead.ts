import { Tag, TagError, TagRepositoryRead } from '@oney/payment-core';
import { injectable } from 'inversify';
import { P2PReferences } from '../../P2PReference';

@injectable()
export class OdbP2PRepositoryRead implements TagRepositoryRead {
  getByRef(ref: number, contractNumber?: string): Promise<Tag> {
    const findRef = P2PReferences.find(item => item.ref === ref);
    if (!findRef) {
      throw new TagError.TagNotFound('TAG_NOT_FOUND');
    }
    return Promise.resolve(
      new Tag({
        ...findRef,
        contractNumber,
        generateUnpaid: findRef.processUnPaid,
        verifyLimits: findRef.checkLimits,
        subscriptionMonthlyNumber: findRef.subscriptionMontlyNumber,
      }),
    );
  }
}
