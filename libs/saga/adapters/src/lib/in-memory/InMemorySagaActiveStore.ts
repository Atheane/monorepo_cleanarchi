import { ActiveSaga, SagaActiveStore, SagaState } from '@oney/saga-core';
import { InMemorySagaCollection } from './InMemorySagaCollection';

export class InMemorySagaActiveStore extends SagaActiveStore {
  private _collection: InMemorySagaCollection;

  constructor(collection: InMemorySagaCollection) {
    super();
    this._collection = collection;
  }

  public persist<TSagaState extends SagaState>(saga: ActiveSaga<TSagaState>) {
    this._collection.addActive(saga);
  }
}
