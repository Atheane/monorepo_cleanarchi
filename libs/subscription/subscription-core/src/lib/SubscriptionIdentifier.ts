export class SubscriptionIdentifier {
  static readonly offerRepository = Symbol.for('offerRepository');
  static readonly subscriberRepository = Symbol.for('subscriberRepository');
  static readonly billingRepository = Symbol.for('billingRepository');
  static readonly subscriptionRepository = Symbol.for('subscriptionRepository');
  static readonly paymentGateway = Symbol.for('paymentGateway');
  static readonly cacheGateway = Symbol.for('CacheGateway');
  static readonly insuranceGateway = Symbol.for('InsuranceGateway');
}
