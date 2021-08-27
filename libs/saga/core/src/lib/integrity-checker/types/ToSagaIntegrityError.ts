import { SagaIntegrityError } from './SagaIntegrityError';
import { SagaHandleDefinition } from '../../models/SagaHandleDefinition';

export class ToSagaIntegrityError extends SagaIntegrityError {
  constructor(definition: SagaHandleDefinition) {
    super({
      saga: definition.owner.target,
      message: `The saga ${definition.owner.target.name} doesn't have 'toSaga' definition for event ${definition.event} handle by ${definition.sagaHandlePropertyKey}`,
      props: {
        definition: definition,
      },
    });
  }
}
