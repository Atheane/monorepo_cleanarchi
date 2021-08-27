import { ActiveSaga } from '../models/ActiveSaga';
import { SagaState } from '../models/SagaState';

export abstract class SagaActiveStore {
  abstract persist<TSagaState extends SagaState>(saga: ActiveSaga<TSagaState>);
}
