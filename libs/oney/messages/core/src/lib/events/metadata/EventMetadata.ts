import 'reflect-metadata';
import { EventCtor } from '../EventCtor';
import { Event } from '../Event';

const EVENT_METADATA_SYMBOL = Symbol.for('EVENT_METADATA_SYMBOL');

export class EventMetadata<TEvent extends Event = Event> {
  public static ensure<TEvent extends Event>(target: EventCtor<TEvent>): EventMetadata<TEvent> {
    if (!Reflect.hasOwnMetadata(EVENT_METADATA_SYMBOL, target)) {
      const schemaMetadata = new EventMetadata(target);

      Reflect.defineMetadata(EVENT_METADATA_SYMBOL, schemaMetadata, target);
    }

    return Reflect.getOwnMetadata(EVENT_METADATA_SYMBOL, target);
  }

  public static getFromCtor<TEvent extends Event>(target: EventCtor<TEvent>): EventMetadata<TEvent> {
    return Reflect.getOwnMetadata(EVENT_METADATA_SYMBOL, target);
  }

  public static getFromInstance<TEvent extends Event>(target: TEvent): EventMetadata<TEvent> {
    return Reflect.getOwnMetadata(EVENT_METADATA_SYMBOL, target.constructor);
  }

  public static getOrThrowFromCtor<TEvent extends Event>(target: EventCtor<TEvent>): EventMetadata<TEvent> {
    const metadata = this.getFromCtor<TEvent>(target);

    if (!metadata) {
      throw new Error(`Metadata not found for Event: ${target.constructor.name}`);
    }

    return metadata;
  }

  public static getOrThrowFromInstance<TEvent extends Event>(target: TEvent): EventMetadata<TEvent> {
    const metadata = this.getFromInstance<TEvent>(target);

    if (!metadata) {
      throw new Error(`Metadata not found for event: ${target.constructor.name}`);
    }

    return metadata;
  }

  constructor(target: EventCtor<TEvent>) {
    this.target = target;
  }

  public target: EventCtor<TEvent>;
  public name: string;
  public namespace?: string;
  public version: number;

  get fullyQualifiedName(): string {
    return EventMetadata.computeFullyQualifiedName(this.namespace, this.name, this.version);
  }

  static computeFullyQualifiedName(namespace: string, name: string, version: number): string {
    return `${namespace}.${name}.${version}`;
  }
}
