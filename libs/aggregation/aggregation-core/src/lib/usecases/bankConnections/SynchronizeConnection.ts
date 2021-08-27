import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Mapper } from '@oney/common-core';
import { Usecase } from '@oney/ddd';
import { BankConnection, BankConnectionRepository, ConnectionStateEnum } from '../../domain';
import { AggregationIdentifier } from '../../AggregationIdentifier';

export interface SynchronizeConnectionCommand {
  refId: string;
  state?: string;
  active: boolean;
}

@injectable()
export class SynchronizeConnection implements Usecase<SynchronizeConnectionCommand, BankConnection> {
  constructor(
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly banksConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.connectionStateMapper)
    private readonly connectionStateMapper: Mapper<ConnectionStateEnum>,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: SynchronizeConnectionCommand): Promise<BankConnection> {
    const { refId, state } = request;
    const bankConnection = await this.banksConnectionRepository.findBy({ refId });
    const _state = this.connectionStateMapper.toDomain(state);
    bankConnection.updateConnection(_state);
    await this.eventDispatcher.dispatch(bankConnection);
    return this.banksConnectionRepository.save(bankConnection.props);
  }
}
