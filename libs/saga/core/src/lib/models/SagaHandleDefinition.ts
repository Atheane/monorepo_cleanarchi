import { Event } from '@oney/messages-core';
import { EventCtor, EventMetadata } from '@oney/messages-core';
import { SagaHandleDefinitionJsonModel } from './SagaHandleDefinitionJsonModel';
import { SagaState } from './SagaState';
import { SagaDefinition } from './SagaDefinition';

export class SagaHandleDefinition<TSagaState extends SagaState = SagaState, TEvent extends Event = Event> {
  event: EventCtor<TEvent>;
  sagaHandlePropertyKey: string;

  fromEventSelect: (event: TEvent) => any;
  toSagaSelect: (event: TSagaState) => any;

  owner: SagaDefinition;

  get eventMetadata() {
    return EventMetadata.getFromCtor<TEvent>(this.event);
  }

  get isStartedByDefinition(): boolean {
    return this.owner.isStartedBy(this.event);
  }

  constructor(owner: SagaDefinition, event: EventCtor<TEvent>, key: string) {
    this.event = event;
    this.owner = owner;
    this.sagaHandlePropertyKey = key;
  }

  setFromEventSelect(select: (event: TEvent) => any) {
    this.fromEventSelect = select;
  }

  setToSagaSelect(select: (event: TSagaState) => any) {
    this.toSagaSelect = select;
  }

  toJSON(): SagaHandleDefinitionJsonModel {
    return {
      isStartedByDefinition: this.isStartedByDefinition,
      event: {
        class: this.eventMetadata.target.name,
        eventName: this.eventMetadata.name,
        namespace: this.eventMetadata.namespace,
        version: this.eventMetadata.version,
      },
      handle: this.sagaHandlePropertyKey,
    };
  }
}
