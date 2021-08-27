import { EventReceiver } from '@oney/messages-core';
import {
  SagaEventRouter,
  SagaRegistry,
  SagaRegistryEntry,
  SagaSubscription,
  SagaSubscriptionProvider,
  SagaTopicProvider,
} from '@oney/saga-core';

interface SubscriptionEntry {
  sub: SagaSubscription;
  entry: SagaRegistryEntry;
}

export class InMemorySagaEventRouter extends SagaEventRouter {
  private _registry: SagaRegistry;
  private _receiver: EventReceiver;
  private _subscriptionProvider: SagaSubscriptionProvider;

  private _subscriptions: SubscriptionEntry[];
  private _topicProvider: SagaTopicProvider;

  constructor(
    registry: SagaRegistry,
    receiver: EventReceiver,
    subscriptionProvider: SagaSubscriptionProvider,
    topicProvider: SagaTopicProvider,
  ) {
    super();

    this._subscriptions = [];
    this._topicProvider = topicProvider;
    this._registry = registry;
    this._receiver = receiver;
    this._subscriptionProvider = subscriptionProvider;
  }

  public initialize() {
    const entries = this._registry.read();
    for (const entry of entries) {
      const subscription = this._subscriptionProvider.provide(entry.definition.target);

      this._subscriptions.push({
        sub: subscription,
        entry: entry,
      });
    }
  }

  public async start() {
    for (const subscription of this._subscriptions) {
      for (const event of subscription.sub.events) {
        const [topic] = this._topicProvider.getTopics(event, subscription.entry);
        await this._receiver.subscribe(
          {
            topic: topic,
            event: event,
            handlerUniqueIdentifier: `Saga-${event.name}-Handler`,
          },
          {
            handle: async e => {
              await subscription.sub.handle(e);
            },
          },
        );
      }
    }
  }
}
