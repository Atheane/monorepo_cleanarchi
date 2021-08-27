import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  HydrateBankAccountService,
  UserGateway,
  BankAccount,
  UserRepository,
  BankAccountRepository,
  BankAccountError,
  BankConnectionRepository,
  BankConnection,
} from '../../domain';
import { RbacError } from '../../domain/models';

export interface GetAllTransactionsdCommands {
  userId: string;
}

@injectable()
export class GetAllTransactions
  implements
    Usecase<GetAllTransactionsdCommands, { bankAccounts: BankAccount[]; bankConnections: BankConnection[] }> {
  constructor(
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.hydrateBankAccountService)
    private readonly hydrateBankAccountService: HydrateBankAccountService,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
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
    request: GetAllTransactionsdCommands,
  ): Promise<{ bankAccounts: BankAccount[]; bankConnections: BankConnection[] }> {
    const { userId } = request;

    // authenticate request
    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);

    const aggregatedAccounts = await this.bankAccountRepository.filterBy({ aggregated: true, userId });

    if (aggregatedAccounts.length === 0) {
      throw new BankAccountError.NoAggregatedAccounts();
    }
    const bankAccounts = await Promise.all(
      aggregatedAccounts.map(async account => {
        const bankConnection = await this.bankConnectionRepository.findBy({
          connectionId: account.props.connectionId,
        });
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

    const bankConnections = await this.bankConnectionRepository.filterBy({ userId });

    return { bankAccounts, bankConnections };
  }
}
