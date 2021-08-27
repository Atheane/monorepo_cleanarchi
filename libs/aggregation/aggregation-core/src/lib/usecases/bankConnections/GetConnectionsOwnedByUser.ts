import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { BankConnection } from '../../domain/aggregates/BankConnection';
import { UserGateway } from '../../domain/gateways/UserGateway';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';
import { RbacError } from '../../domain/models';
import { BankAccountRepository, BankRepository, Bank } from '../../domain';

export interface GetConnectionsByUserCommand {
  userId: string;
}

@injectable()
export class GetConnectionsOwnedByUser
  implements Usecase<GetConnectionsByUserCommand, { bankConnections: BankConnection[]; banks: Bank[] }> {
  constructor(
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,

    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,

    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,

    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,

    @inject(AggregationIdentifier.bankRepository)
    private readonly bankRepository: BankRepository,
  ) {}

  async canExecute(identity: Identity): Promise<boolean> {
    const roles = identity.roles.find(item => item.scope.name === ServiceName.aggregation);
    if (roles.permissions.read !== Authorization.self) {
      throw new RbacError.UserCannotRead(
        `user ${identity.uid} not allowed to read on ${ServiceName.aggregation}`,
      );
    }
    return true;
  }

  async execute(
    request: GetConnectionsByUserCommand,
  ): Promise<{ bankConnections: BankConnection[]; banks: Bank[] }> {
    const { userId } = request;
    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);
    const bankConnections: BankConnection[] = await this.bankConnectionRepository.filterBy({ userId });
    const banks = await Promise.all(
      bankConnections.map(bankConnection => this.bankRepository.getById(bankConnection.props.bankId)),
    );

    const bankConnectionsWithBankAccounts = await Promise.all(
      bankConnections.map(async bankConnection => {
        const bankAccounts = await this.bankAccountRepository.filterBy({
          userId,
          connectionId: bankConnection.props.connectionId,
          aggregated: true,
        });
        bankConnection.setBankAccounts(bankAccounts);
        return bankConnection;
      }),
    );
    return { bankConnections: bankConnectionsWithBankAccounts, banks };
  }
}
