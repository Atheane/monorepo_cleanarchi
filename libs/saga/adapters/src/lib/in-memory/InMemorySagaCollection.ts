import { ActiveSaga, SagaDefinition, SagaState } from '@oney/saga-core';

export class InMemorySagaCollection {
  private _activeCollection: Map<string, ActiveSaga<SagaState>>;
  private _definitionCollection: SagaDefinition<SagaState>[];

  constructor() {
    this._activeCollection = new Map<string, ActiveSaga<SagaState>>();
    this._definitionCollection = [];
  }

  addDefinition(input: SagaDefinition<SagaState>) {
    this._definitionCollection.push(input);
  }

  addActive(input: ActiveSaga<SagaState>) {
    this._activeCollection.set(input.activeSagaId, input);
  }

  readDefinitions() {
    return this._definitionCollection;
  }

  readActive() {
    return Array.from(this._activeCollection.values());
  }
}
