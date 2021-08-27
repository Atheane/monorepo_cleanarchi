import { Event, EventCtor } from '@oney/messages-core';
import { SagaMetadata } from '../metadata/SagaMetadata';

export function Handle<TEvent extends Event>(event: EventCtor<TEvent>): Function {
  return function (target: any, key: any) {
    const definition = SagaMetadata.ensureSagaDefinition(target.constructor);

    definition.addHandle(event, key);
  };
}
