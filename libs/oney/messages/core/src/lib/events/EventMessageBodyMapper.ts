import { OneyExecutionContext } from '@oney/context';
import { EventMessageBody } from './EventMessageBody';
import { Event } from './Event';

export abstract class EventMessageBodyMapper {
  abstract toEvent<TEvent extends Event = Event>(messageBody: EventMessageBody): TEvent;
  abstract toEventMessageBody<TEvent extends Event = Event>(
    event: TEvent,
    context?: OneyExecutionContext,
  ): EventMessageBody;
}
