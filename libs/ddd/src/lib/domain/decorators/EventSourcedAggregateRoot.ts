import { ReflectMetadataService } from '../services/ReflectMetadataService';

export function EventSourcedAggregateRoot(): Function {
  return function (target: any) {
    ReflectMetadataService.ensureSchemaMetadata(target);
  };
}
