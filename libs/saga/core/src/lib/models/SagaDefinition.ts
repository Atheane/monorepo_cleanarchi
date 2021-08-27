import { Event } from '@oney/messages-core';
import { EventCtor } from '@oney/messages-core';
import { SagaDefinitionJsonModel } from './SagaDefinitionJsonModel';
import { SagaHandleDefinition } from './SagaHandleDefinition';
import { SagaState } from './SagaState';
import { SagaMetadata } from '../metadata/SagaMetadata';
import { SagaWorkflowCtor } from '../types/SagaWorkflowCtor';

export class SagaDefinition<T extends SagaState = SagaState> {
  public target: SagaWorkflowCtor<T>;

  public id: string;
  public namespace: string;
  public version: number;

  // todo make getter better
  public startedByDefinition: SagaHandleDefinition<T>;
  public handles: SagaHandleDefinition<T>[];

  constructor(target: SagaWorkflowCtor<T>) {
    this.target = target;
    this.handles = [];
  }

  get events() {
    const events: EventCtor<Event>[] = [];

    if (this.startedByDefinition) {
      events.push(this.startedByDefinition.event);
    }

    this.handles.forEach(x => {
      events.push(x.event);
    });

    return events;
  }

  public setSagaMetadata(id: string, namespace: string, version: number) {
    this.id = id;
    this.namespace = namespace;
    this.version = version;
  }

  public setStartedByEvent<TEvent extends Event>(event: EventCtor<TEvent>, key: string) {
    if (this.startedByDefinition) {
      throw new Error("StartedBy event handler was already defined, it's currently not supported");
    }

    this.startedByDefinition = new SagaHandleDefinition(this, event, key);
  }

  public addHandle<TEvent extends Event>(event: EventCtor<TEvent>, key: string) {
    // todo check already defined
    const definition = new SagaHandleDefinition<T>(this, event, key);
    this.handles.push(definition);
  }

  public findDefinitionByEvent<TEvent extends Event>(
    event: EventCtor<TEvent>,
  ): SagaHandleDefinition<T, TEvent> {
    if (this.startedByDefinition && this.startedByDefinition.event === event) {
      return this.startedByDefinition as SagaHandleDefinition<T, TEvent>;
    }

    return this.handles.find(x => x.event === event) as SagaHandleDefinition<T, TEvent>;
  }

  public isStartedBy<TEvent extends Event>(event: EventCtor<TEvent>) {
    return this.startedByDefinition.event === event;
  }

  public getDefinitionIsHandleBy<TEvent extends Event>(event: EventCtor<TEvent>) {
    return this.handles.find(x => x.event === event);
  }

  toJSON(): SagaDefinitionJsonModel {
    return {
      saga: {
        class: this.target.name,
        namespace: this.namespace,
        id: this.id,
        version: this.version,
      },
      startedByDefinition: this.startedByDefinition.toJSON(),
      handles: this.handles.map(x => x.toJSON()),
    };
  }

  get fullyQualifiedName() {
    return SagaMetadata.computeFullyQualifiedName(this.namespace, this.id, this.version);
  }
}
