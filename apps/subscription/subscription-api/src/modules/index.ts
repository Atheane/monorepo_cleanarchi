import { Container } from 'inversify';
import { buildHealthcheckModule } from './healthcheck';
import { buildOfferModule } from './offers';
import { buildSubscriptionModule } from './subscriptions';

export function buildModules(container: Container): void {
  buildHealthcheckModule(container);
  buildOfferModule(container);
  buildSubscriptionModule(container);
}
