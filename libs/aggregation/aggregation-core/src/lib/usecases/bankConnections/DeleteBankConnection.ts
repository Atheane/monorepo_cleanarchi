import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { BankConnectionGateway, UserRepository, UserGateway, BankAccountRepository } from '../../domain';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';
import { RbacError } from '../../domain/models';

export interface DeleteCommand {
  userId: string;
  connectionId: string;
}

@injectable()
export class DeleteBankConnection implements Usecase<DeleteCommand, void> {
  constructor(
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.bankConnectionGateway)
    private readonly bankConnectionGateway: BankConnectionGateway,
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async canExecute(identity: Identity): Promise<boolean> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.aggregation);
    if (roles.permissions.write !== Authorization.self) {
      throw new RbacError.UserCannotWrite(
        `user ${identity.uid} not allowed to write on ${ServiceName.aggregation}`,
      );
    }
    return true;
  }

  async execute(request: DeleteCommand): Promise<void> {
    const { userId, connectionId } = request;

    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);

    const bankConnection = await this.bankConnectionRepository.findBy({ connectionId });

    const bankAccounts = await this.bankAccountRepository.filterBy({
      connectionId,
    });
    bankConnection.setBankAccounts(bankAccounts);

    await this.bankConnectionRepository.deleteOne(connectionId);
    await this.bankConnectionGateway.deleteOne(bankConnection.props.refId);

    await Promise.all(
      bankAccounts.map(bankAccount => this.bankAccountRepository.deleteOne(bankAccount.props.id)),
    );

    bankConnection.delete();
    await this.eventDispatcher.dispatch(bankConnection);
  }
}
