import { injectable } from 'inversify';
import { Event } from './Event';
import { EventMessageBodyMapper } from './EventMessageBodyMapper';
import { EventMessageBodySerializer } from './EventMessageBodySerializer';
import { Dispatcher } from '../common/Dispatcher';

export interface EventDispatcherOptions {
  customMapper?: EventMessageBodyMapper;
  customSerializer?: EventMessageBodySerializer;
}

@injectable()
export abstract class EventDispatcher<TEvent extends Event = Event> extends Dispatcher<
  TEvent,
  EventDispatcherOptions
> {}
