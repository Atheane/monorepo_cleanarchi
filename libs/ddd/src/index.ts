/**
 * @packageDocumentation
 * @module ddd
 */

export { DomainEventHandler } from './lib/domain/gateways/DomainEventHandler';
export { DomainEvent } from './lib/domain/entities/DomainEvent';
export { Entity } from './lib/domain/entities/Entity';
export { ValueObject } from './lib/domain/entities/ValueObject';
export { DomainEventProducer } from './lib/domain/entities/DomainEventProducer';
export { AggregateRoot } from './lib/domain/entities/AggregateRoot';
export { EventSubscription } from './lib/domain/models/EventSubscription';
export { DomainEventProps } from './lib/domain/types/DomainEventProps';
export { buildDomainEventDependencies } from './lib/di/inversify';
export { MessagingPlugin } from './lib/domain/services/MessagingPlugin';
export { Usecase } from './lib/domain/models/Usecase';
export { DomainEventMetadata } from './lib/domain/types/DomainEventMetadata';
export { Handle } from './lib/domain/decorators/Handle';
