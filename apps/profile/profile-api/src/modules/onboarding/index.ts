import { Container } from 'inversify';
import { OnboardingController } from './OnboardingController';
import { SubscriptionCreatedHandler } from './handlers/SubscriptionCreatedHandler';

export function buildKycModule(container: Container): void {
  container.bind(OnboardingController).to(OnboardingController);
  container.bind(SubscriptionCreatedHandler).to(SubscriptionCreatedHandler);
}
