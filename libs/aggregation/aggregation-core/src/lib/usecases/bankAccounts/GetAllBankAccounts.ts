import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  Bank,
  BankRepository,
  BankAccount,
  BankAccountRepository,
  UserGateway,
  UserRepository,
  RbacError,
  BankAccountGateway,
  BankConnection,
  BankConnectionRepository,
} from '../../domain';

export interface GetAllBankAccountsCommands {
  userId: string;
}

@injectable()
export class GetAllBankAccounts
  implements Usecase<GetAllBankAccountsCommands, { bankAccounts: BankAccount[]; banks: Bank[] }> {
  constructor(
    @inject(AggregationIdentifier.bankRepository)
    private readonly bankRepository: BankRepository,
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.bankAccountGateway)
    private readonly bankAccountGateway: BankAccountGateway,
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
    request: GetAllBankAccountsCommands,
  ): Promise<{ bankAccounts: BankAccount[]; banks: Bank[] }> {
    const { userId } = request;
    // authenticate request
    const user = await this.userRepository.findBy({ userId });

    this.userGateway.setCredentials(user.props.credential);

    const allBankAccounts = await this.bankAccountRepository.filterBy({ userId });
    let aggregatedAccounts = allBankAccounts.filter(account => account.props.aggregated == true);

    // If no aggregated bankAccounts are found, fetch those in connection repo and add them to the account repo
    if (allBankAccounts.length == 0) {
      const bankConnections: BankConnection[] = await this.bankConnectionRepository.filterBy({ userId });
      await Promise.all(
        bankConnections.map(async bankConnection => {
          let accounts = await this.bankAccountGateway.getAccountsFromRefId(bankConnection.props.refId);
          accounts = accounts.filter(account => account.props.aggregated == true);
          aggregatedAccounts = aggregatedAccounts.concat(accounts);
          await Promise.all(accounts.map(account => this.bankAccountRepository.save(account.props)));
        }),
      );
    }

    const banks = await Promise.all(
      aggregatedAccounts.map(bankAccount => this.bankRepository.getById(bankAccount.props.bankId)),
    );
    return { bankAccounts: aggregatedAccounts, banks };
  }
}
