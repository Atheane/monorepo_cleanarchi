import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { BankConnection } from '../../domain/aggregates/BankConnection';
import { BankAccount } from '../../domain/aggregates/BankAccount';
import { UserGateway } from '../../domain/gateways/UserGateway';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';
import { BankAccountError } from '../../domain/models/BankAccountErrors';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { BankAccountRepository } from '../../domain/repositories/BankAccountRepository';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';
import { HydrateBankAccountService } from '../../domain/services/HydrateBankAccountService';
import { RbacError } from '../../domain/models';

export interface GetTransactionsByConnectionIdCommands {
  userId: string;
  connectionId: string;
}

@injectable()
export class GetTransactionsByConnectionId
  implements
    Usecase<
      GetTransactionsByConnectionIdCommands,
      Promise<{ bankAccounts: BankAccount[]; bankConnection: BankConnection }>
    > {
  constructor(
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.hydrateBankAccountService)
    private readonly hydrateBankAccountService: HydrateBankAccountService,
    @inject(AggregationIdentifier.bankAccountGateway)
    private readonly bankAccountGateway: BankAccountGateway,
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
    request: GetTransactionsByConnectionIdCommands,
  ): Promise<{ bankAccounts: BankAccount[]; bankConnection: BankConnection }> {
    const { userId, connectionId } = request;
    // authenticate request
    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);

    // check if user has aggregated accounts for this connection
    const bankConnection = await this.bankConnectionRepository.findBy({ connectionId });
    const aggregatedAccounts = await this.bankAccountRepository.filterBy({
      userId,
      aggregated: true,
      connectionId: bankConnection.props.connectionId,
    });
    if (aggregatedAccounts.length === 0) {
      throw new BankAccountError.NoAggregatedAccounts();
    }

    const bankAccounts = await Promise.all(
      aggregatedAccounts.map(async account => {
        const identityInformation = await this.hydrateBankAccountService.getOwnerIdentity(
          bankConnection.props.refId,
        );
        const transactions = await this.hydrateBankAccountService.getBankAccountTransactions(
          account.props.id,
        );
        account.setOwnerIdentity(identityInformation);
        account.setTransactions(transactions);
        return account;
      }),
    );

    return { bankAccounts, bankConnection };
  }
}
