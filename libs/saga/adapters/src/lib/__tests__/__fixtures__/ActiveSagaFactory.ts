import { ActiveSaga, SagaMetadata } from '@oney/saga-core';
import { v4 } from 'uuid';
import { SampleSaga } from './sample-saga/SampleSaga';

export class ActiveSagaFactory {
  static generate() {
    const definition = SagaMetadata.getSagaDefinitionFromCtor(SampleSaga);
    return new ActiveSaga({
      activeSagaId: v4(),
      definition: definition,
      instance: new SampleSaga(),
      history: [],
      createdAt: new Date(Date.now()),
      updatedAt: new Date(Date.now()),
    });
  }
}
