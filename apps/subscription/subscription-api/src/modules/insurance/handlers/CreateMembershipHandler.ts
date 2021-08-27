import { DomainEventHandler } from '@oney/ddd';
import { CreateMembership } from '@oney/subscription-messages';
import { CreateMembershipInsurance } from '@oney/subscription-core';
import { injectable } from 'inversify';

@injectable()
export class CreateMembershipHandler extends DomainEventHandler<CreateMembership> {
  constructor(private readonly _createMembershipInsurance: CreateMembershipInsurance) {
    super();
  }

  async handle(domainEvent: CreateMembership): Promise<void> {
    const { subscriptionId, profileInfo, bankAccountInfo, creditCardInfo } = domainEvent.props;
    return await this._createMembershipInsurance.execute({
      subscriptionId,
      profileInfo,
      bankAccountInfo,
      creditCardInfo,
    });
  }
}
