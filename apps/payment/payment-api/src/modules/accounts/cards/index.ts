import { Container } from 'inversify';
import { CardController } from './controllers/CardController';
import { CardWithLimitsMapper } from './mappers/CardWithLimitsMapper';

export function buildCardsModule(container: Container) {
  container.bind(CardWithLimitsMapper).to(CardWithLimitsMapper);
  container.bind(CardController).to(CardController);
}
