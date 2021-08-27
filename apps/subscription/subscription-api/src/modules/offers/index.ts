import { Container } from 'inversify';
import { OfferController } from './OfferController';

export function buildOfferModule(container: Container): void {
  container.bind(OfferController).to(OfferController);
}
