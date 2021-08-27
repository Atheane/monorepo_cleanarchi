import { SagaDefinition, SagaDefinitionRepository, SagaDefinitionStore, SagaState } from '@oney/saga-core';
import { SagaDefinitionMapper } from './mongodb/SagaDefinitionMapper';

export class DefaultSagaDefinitionStore extends SagaDefinitionStore {
  private _repository: SagaDefinitionRepository;
  private _mapper: SagaDefinitionMapper;

  constructor(repository: SagaDefinitionRepository, mapper: SagaDefinitionMapper) {
    super();
    this._repository = repository;
    this._mapper = mapper;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
  public async persist<TSagaState extends SagaState>(definition: SagaDefinition<TSagaState>) {
    const mappedDefinition = this._mapper.toPersistence(definition);
    await this._repository.persist(mappedDefinition);
  }
}
