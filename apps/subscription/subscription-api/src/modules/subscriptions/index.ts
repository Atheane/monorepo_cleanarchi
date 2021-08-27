import { Container } from 'inversify';
import { SubscriptionController } from './api/SubscriptionController';
import { SubscriptionResponseMapper } from './api/dto/SubscriptionResponseMapper';

export function buildSubscriptionModule(container: Container): void {
  container.bind(SubscriptionController).to(SubscriptionController);
  container.bind(SubscriptionResponseMapper).toSelf();
}
