import { defaultLogger } from '@oney/logger-adapters';
import { DefaultEventMessageBodyMapper, DefaultEventMessageBodySerializer } from '@oney/messages-adapters';
import { Event, EventDispatcher, EventDispatcherOptions, EventMetadata } from '@oney/messages-core';
import { injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { RxServiceBus } from './RxServiceBus';
import { RxMessage } from './types/RxMessage';

@injectable()
export class RxEventDispatcher extends EventDispatcher {
  private _rxServiceBus: RxServiceBus;
  private _defaultMapper: DefaultEventMessageBodyMapper;
  private _defaultSerializer: DefaultEventMessageBodySerializer;

  constructor(rxServiceBus: RxServiceBus) {
    super();
    this._rxServiceBus = rxServiceBus;
    this._defaultMapper = new DefaultEventMessageBodyMapper();
    this._defaultSerializer = new DefaultEventMessageBodySerializer();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async doDispatch(events: Event[], options?: EventDispatcherOptions): Promise<void> {
    // todo implements options use

    const partitionKeyId = uuidv4();

    for (const event of events) {
      this.publish(event, partitionKeyId, options);
    }
  }

  private publish(event: Event, partitionKeyId?: string, options?: EventDispatcherOptions) {
    const mapper = options?.customMapper ?? this._defaultMapper;
    const serializer = options?.customSerializer ?? this._defaultSerializer;
    const metadata = EventMetadata.getOrThrowFromInstance(event);
    const eventMessageBody = mapper.toEventMessageBody(event);
    const serializedBody = serializer.serialize(eventMessageBody);

    const message: RxMessage = {
      body: serializedBody,
      metadata: metadata,
      label: metadata.name,
      messageId: partitionKeyId,
    };

    defaultLogger.info(`Send rx event ${metadata.fullyQualifiedName}`);

    this._rxServiceBus.next(message);
  }
}
