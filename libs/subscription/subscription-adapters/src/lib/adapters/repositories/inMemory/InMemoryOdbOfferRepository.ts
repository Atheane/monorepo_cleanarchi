import { Offer, OfferRepository, SubscriptionErrors } from '@oney/subscription-core';
import { injectable } from 'inversify';
import { offers } from '../../partners/odb/offers/offers';
import { OdbOfferMapper } from '../../partners/odb/mappers/OdbOfferMapper';

@injectable()
export class InMemoryOdbOfferRepository implements OfferRepository {
  constructor(private readonly _odbGetOfferByIdMapper: OdbOfferMapper) {}

  async getAll(): Promise<Offer[]> {
    return offers.map(offer => this._odbGetOfferByIdMapper.toDomain(offer));
  }

  async getById(id: string): Promise<Offer> {
    const offer = offers.find(offer => offer.id === id);
    if (!offer) {
      throw new SubscriptionErrors.OfferNotFound('OFFER_NOT_FOUND');
    }
    return this._odbGetOfferByIdMapper.toDomain(offer);
  }
}
