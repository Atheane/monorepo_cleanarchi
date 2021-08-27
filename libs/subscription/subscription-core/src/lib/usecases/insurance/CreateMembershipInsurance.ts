import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { CreateMembershipCommand } from '@oney/subscription-messages';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { SubscriptionRepository } from '../../domain/repositories/SubscriptionRepository';
import { InsuranceGateway } from '../../domain/gateways/InsuranceGateway';
import { OfferRepository } from '../../domain/repositories/OfferRepository';

@injectable()
export class CreateMembershipInsurance implements Usecase<CreateMembershipCommand, void> {
  constructor(
    @inject(SubscriptionIdentifier.subscriptionRepository)
    private readonly _subscriptionRepository: SubscriptionRepository,
    @inject(SubscriptionIdentifier.offerRepository)
    private readonly _offerRepository: OfferRepository,
    @inject(SubscriptionIdentifier.insuranceGateway)
    private readonly _insuranceGateway: InsuranceGateway,
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateMembershipCommand): Promise<void> {
    const subscription = await this._subscriptionRepository.getById(request.subscriptionId);
    const offer = await this._offerRepository.getById(subscription.props.offerId);
    const { insuranceMembershipId } = await this._insuranceGateway.createMembership({
      offerType: offer.props.type,
      profileInfo: request.profileInfo,
      bankAccountInfo: request.bankAccountInfo,
      creditCardInfo: request.creditCardInfo,
    });
    await this._insuranceGateway.activateMembership({ insuranceMembershipId });
    subscription.createInsuranceMembership(insuranceMembershipId);
    await this._subscriptionRepository.save(subscription);
    await this._eventDispatcher.dispatch(subscription);
    return;
  }
}
