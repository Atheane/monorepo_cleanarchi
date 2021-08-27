import 'reflect-metadata';
import { SagaState } from '../models/SagaState';
import { SagaDefinition } from '../models/SagaDefinition';
import { SagaWorkflowCtor } from '../types/SagaWorkflowCtor';

const sagaDefinitionSymbol = Symbol.for('sagaDefinitionSymbol');

export class SagaMetadata {
  public static ensureSagaDefinition<T extends SagaState>(target: SagaWorkflowCtor<T>): SagaDefinition<T> {
    if (!Reflect.hasOwnMetadata(sagaDefinitionSymbol, target)) {
      const schemaMetadata = new SagaDefinition(target);

      Reflect.defineMetadata(sagaDefinitionSymbol, schemaMetadata, target);
    }

    return Reflect.getOwnMetadata(sagaDefinitionSymbol, target);
  }

  public static getSagaDefinitionFromCtor<T extends SagaState>(
    target: SagaWorkflowCtor<T>,
  ): SagaDefinition<T> {
    return Reflect.getOwnMetadata(sagaDefinitionSymbol, target);
  }

  public static computeFullyQualifiedName(namespace: string, name: string, version: number): string {
    return `${namespace}.${name}.${version}`;
  }
}
