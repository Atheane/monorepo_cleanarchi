import { Offer } from '../aggregates/Offer';

export interface OfferRepository {
  getAll(): Promise<Offer[]>;
  getById(id: string): Promise<Offer>;
}
