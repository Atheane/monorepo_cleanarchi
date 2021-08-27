import { ActiveSaga, ActiveSagaRepository, SagaActiveStore, SagaState } from '@oney/saga-core';
import { ActiveSagaMapper } from './mongodb/ActiveSagaMapper';

export class DefaultSagaActiveStore extends SagaActiveStore {
  private _repository: ActiveSagaRepository;
  private _mapper: ActiveSagaMapper;

  constructor(repository: ActiveSagaRepository, mapper: ActiveSagaMapper) {
    super();
    this._repository = repository;
    this._mapper = mapper;
  }

  public async persist<TSagaState extends SagaState>(saga: ActiveSaga<TSagaState>) {
    const mappedSaga = this._mapper.toPersistence(saga);
    await this._repository.persist(mappedSaga);
  }
}
