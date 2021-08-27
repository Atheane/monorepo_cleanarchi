import { OneyExecutionContext } from '@oney/context';
import { EventMessageBody, EventMessageBodyMapper, Event, EventMetadata } from '@oney/messages-core';

export class DefaultEventMessageBodyMapper extends EventMessageBodyMapper {
  public toEvent<TEvent extends Event = Event>(messageBody: EventMessageBody): TEvent {
    return ({
      id: messageBody.id as string,
      props: messageBody,
      metadata: messageBody.domainEventProps.metadata,
      timestamp: messageBody.domainEventProps.timestamp,
      createdAt: messageBody.domainEventProps.createdAt,
      sentAt: new Date(messageBody.domainEventProps.timestamp), // for legacy compatibility
    } as unknown) as TEvent;
  }

  public toEventMessageBody<TEvent extends Event = Event>(
    event: TEvent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context?: OneyExecutionContext,
  ): EventMessageBody {
    const metadata = EventMetadata.getOrThrowFromInstance(event);

    const namespace = metadata.namespace;
    const eventName = metadata.name;
    const version = metadata.version;
    const timestamp = Date.now();

    return {
      ...event.props,
      domainEventProps: {
        ...(event.createdAt && {
          createdAt: event.createdAt,
        }),
        timestamp,
        sentAt: new Date(timestamp).toISOString(), // for legacy compatibility
        id: event.id,
        metadata: {
          ...(event as any).metadata, // for legacy reason
          namespace,
          eventName,
          version,
        },
      },
    };
  }
}
