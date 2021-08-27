import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Offer } from '../../domain/aggregates/Offer';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { OfferRepository } from '../../domain/repositories/OfferRepository';

@injectable()
export class GetOffers implements Usecase<null, Offer[]> {
  constructor(
    @inject(SubscriptionIdentifier.offerRepository) private readonly _offerRepository: OfferRepository,
  ) {}

  async execute(): Promise<Offer[]> {
    return await this._offerRepository.getAll();
  }
}
