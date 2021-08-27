import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  User,
  UserGateway,
  BankAccountError,
  CreditDecisioningError,
  UserRepository,
  BankAccountRepository,
  CreditDecisioningService,
  BankAccountGateway,
  RbacError,
} from '../../domain';

export interface PostAllTransactionsCommand {
  userId: string;
}

@injectable()
export class PostAllTransactions implements Usecase<PostAllTransactionsCommand, User> {
  constructor(
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.creditDecisioningService)
    private readonly creditDecisioningService: CreditDecisioningService,
    @inject(AggregationIdentifier.bankAccountGateway)
    private readonly bankAccountGateway: BankAccountGateway,
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

  async execute(request: PostAllTransactionsCommand): Promise<User> {
    const { userId } = request;
    const user: User = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);
    if (user.props.creditDecisioningUserId) {
      throw new CreditDecisioningError.TransactionsAlreadyPosted();
    }

    const aggregatedAccounts = await this.bankAccountRepository.filterBy({ aggregated: true, userId });
    if (aggregatedAccounts.length === 0) {
      throw new BankAccountError.NoAggregatedAccounts();
    }

    user.update({ aggregatedBankAccounts: aggregatedAccounts });

    const creditDecisioningUserId = await this.creditDecisioningService.createCreditDecisioningUser();
    user.update({
      creditDecisioningUserId,
    });
    await this.userRepository.update(userId, {
      creditDecisioningUserId,
    });

    const accountsWithCreditDecisioningAccountId = await this.creditDecisioningService.addBankAccountsToUser(
      user,
    );
    user.update({ aggregatedBankAccounts: accountsWithCreditDecisioningAccountId });

    const unsavedTransactions = await this.creditDecisioningService.addTransactionsToUser(user);
    await this.bankAccountGateway.disaggregateAccounts(aggregatedAccounts);
    user.update({ unsavedTransactions });
    return user;
  }
}
