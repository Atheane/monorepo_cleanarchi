import { Mapper } from '@oney/common-core';
import { Subscription } from '@oney/subscription-core';
import { injectable } from 'inversify';

@injectable()
export class SubscriptionResponseMapper implements Mapper<Subscription> {
  fromDomain(t: Subscription): any {
    return {
      ...(t.props.activationDate && {
        activationDate: t.props.activationDate,
      }),
      ...(t.props.insuranceMembershipId && {
        insuranceMembershipId: t.props.insuranceMembershipId,
      }),
      ...(t.props.nextBillingDate && {
        nextBillingDate: t.props.nextBillingDate,
      }),
      ...(t.props.cardId && {
        cardId: t.props.cardId,
      }),
      ...(t.props.endDate && {
        endDate: t.props.endDate,
      }),
      status: t.props.status,
      id: t.id,
      offerId: t.props.offerId,
      subscriberId: t.props.subscriberId,
    };
  }
}
