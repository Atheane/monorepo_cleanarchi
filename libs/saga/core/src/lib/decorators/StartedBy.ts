import { Event } from '@oney/messages-core';
import { EventCtor } from '@oney/messages-core';
import { SagaMetadata } from '../metadata/SagaMetadata';

export function StartedBy<TEvent extends Event>(event: EventCtor<TEvent>): Function {
  return function (target: any, key: any) {
    const definition = SagaMetadata.ensureSagaDefinition(target.constructor);

    definition.setStartedByEvent(event, key);
  };
}
