import {
  Event,
  EventCtor,
  EventHandlerCtor,
  EventHandlerRegistration,
  EventHandlerRegistrationOptions,
  EventHandlerRegistry,
  EventMetadata,
  EventReceiver,
} from '@oney/messages-core';
import { Container, injectable } from 'inversify';
import { TopicProviderFromRegistration } from './events/TopicProviderFromRegistration';

// it's a temporary implementation before @oney/application introduction
@injectable()
export class EventManager {
  private _receiver: EventReceiver;
  private _registry: EventHandlerRegistry;
  private _container: Container;
  private _topicProvider: TopicProviderFromRegistration;

  constructor(
    container: Container,
    receiver: EventReceiver,
    registry: EventHandlerRegistry,
    topicProvider: TopicProviderFromRegistration, // it used a specific implementation for legacy reason
  ) {
    this._container = container;
    this._receiver = receiver;
    this._registry = registry;
    this._topicProvider = topicProvider;
  }

  register<TEvent extends Event>(
    event: EventCtor<TEvent>,
    handler: EventHandlerCtor<TEvent>,
    options?: EventHandlerRegistrationOptions,
  ): this {
    this._registry.register(event, handler, options);
    return this;
  }

  async start(): Promise<void> {
    // todo subscribe all handlers
    const registrations = await this._registry.read();
    const promises = registrations.map(x => this.doRegistration(x));

    await Promise.all(promises);
  }

  private async doRegistration(registration: EventHandlerRegistration) {
    console.log('Process handler', registration.handler);

    // todo it should be moved in another location
    EventMetadata.getOrThrowFromCtor(registration.event);

    const handler = this._container.resolve(registration.handler);

    const [topic] = this._topicProvider.getTopics(registration);

    await this._receiver.subscribe(
      {
        topic: topic,
        event: registration.event,
        customSerializer: registration.options?.customSerializer,
        customMapper: registration.options?.customMapper,
      },
      handler,
    );
  }
}
