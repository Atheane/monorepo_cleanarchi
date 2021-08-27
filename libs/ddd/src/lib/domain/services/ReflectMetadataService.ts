import { ClassType } from '@oney/common-core';
import { EventSourcedAggregateRootMetadata } from '../models/EventSourcedAggregateRootMetadata';
import { eventSourceAggregateRootSym } from '../symbols/eventSourceAggregateRootSym';

export class ReflectMetadataService {
  public static ensureSchemaMetadata<T>(target: ClassType<T>): EventSourcedAggregateRootMetadata<T> {
    if (!Reflect.hasOwnMetadata(eventSourceAggregateRootSym, target)) {
      const schemaMetadata = new EventSourcedAggregateRootMetadata(target);
      Reflect.defineMetadata(eventSourceAggregateRootSym, schemaMetadata, target);
    }
    return Reflect.getOwnMetadata(eventSourceAggregateRootSym, target);
  }
  public static getSchemaMetadata<T>(target: T): EventSourcedAggregateRootMetadata<T> {
    return Reflect.getOwnMetadata(eventSourceAggregateRootSym, target);
  }
  public static hasSchemaMetadata<T>(target: T): boolean {
    return Reflect.hasOwnMetadata(eventSourceAggregateRootSym, target);
  }
}
