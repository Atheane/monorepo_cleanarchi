import { ClassType } from '@oney/common-core';
import { DomainEvent } from '../entities/DomainEvent';
import { ReflectMetadataService } from '../services/ReflectMetadataService';

export function Handle<T extends DomainEvent<any>>(event: ClassType<T>): Function {
  return function (target: any, functionName: any) {
    const meta = ReflectMetadataService.ensureSchemaMetadata(target.constructor);
    // todo check the key index
    meta.handlers.set(event.name, functionName);
  };
}
