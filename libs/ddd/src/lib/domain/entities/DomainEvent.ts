import { Event } from '@oney/messages-core';
import { DomainEventMetadata } from '../types/DomainEventMetadata';

export interface DomainEvent<TProps extends object = object> extends Event<TProps> {
  metadata?: DomainEventMetadata;
}
