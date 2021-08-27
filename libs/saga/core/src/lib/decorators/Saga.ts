import { injectable } from 'inversify';
import { assert } from 'ts-essentials';
import { SagaMetadata } from '../metadata/SagaMetadata';

export interface SagaOptions {
  id: string;
  namespace: string;
  version: number;
}

// todo manage Saga inheritance
export function Saga(options: SagaOptions): Function {
  assert(options);
  assert(options.id != null);
  assert(options.namespace != null);
  assert(options.version != null);

  return function (target: any) {
    const definition = SagaMetadata.ensureSagaDefinition(target);

    definition.setSagaMetadata(options.id, options.namespace, options.version);

    injectable()(target);
  };
}
