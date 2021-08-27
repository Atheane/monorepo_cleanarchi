import { Newable } from 'ts-essentials';
import { DomainEvent } from '../entities/DomainEvent';

export type EventCtor<TEvent extends DomainEvent> = Newable<TEvent>;
