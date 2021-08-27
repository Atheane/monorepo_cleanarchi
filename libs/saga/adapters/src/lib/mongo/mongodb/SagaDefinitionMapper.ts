import { SagaDefinition, SagaDefinitionDataModel, SagaState } from '@oney/saga-core';
import { SagaDefinitionDoc } from './schemas/SagaDefinitionSchema';

export class SagaDefinitionMapper {
  toPersistence<TSagaState extends SagaState>(
    definition: SagaDefinition<TSagaState>,
  ): SagaDefinitionDataModel {
    return definition.toJSON();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toModel(definition: SagaDefinitionDoc): SagaDefinition<SagaState> {
    // todo make a real instance
    throw new Error('NOT_IMPLEMENTED');
  }
}
