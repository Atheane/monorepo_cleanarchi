import { Usecase } from '@oney/ddd';
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
} from '../../domain';

export interface UploadUserDataCommand {
  userId: string;
}

@injectable()
export class UploadUserDataToCreditDecisioningPartner implements Usecase<UploadUserDataCommand, void> {
  constructor(
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.creditDecisioningService)
    private readonly creditDecisioningService: CreditDecisioningService,
  ) {}

  async execute(request: UploadUserDataCommand): Promise<void> {
    const { userId } = request;
    const user: User = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);
    if (user.props.creditDecisioningUserId) {
      throw new CreditDecisioningError.TransactionsAlreadyPosted();
    }
    const aggregatedBankAccounts = await this.bankAccountRepository.filterBy({
      aggregated: true,
      isOwnerBankAccount: true,
      userId,
    });

    if (aggregatedBankAccounts.length === 0) {
      throw new BankAccountError.NoAggregatedAccounts('NO_OWNED_AGGREGATED_ACCOUNTS');
    }
    user.update({ aggregatedBankAccounts });

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
    await this.creditDecisioningService.addTransactionsToUser(user);
  }
}
