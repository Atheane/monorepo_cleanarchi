import { Newable } from 'ts-essentials';
import { EventHandler } from './EventHandler';
import { Event } from '../Event';

export type EventHandlerCtor<TEvent extends Event> = Newable<EventHandler<TEvent>>;
