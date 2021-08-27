import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { EventProducerDispatcher } from '@oney/messages-core';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  UserGateway,
  UserRepository,
  CreditDecisioningService,
  BankAccountRepository,
  User,
} from '../../domain';

export interface SendUserRevenueDataToUpcapLimitCommand {
  banksUserId: string; //from rest hook
}

@injectable()
export class SendUserRevenueDataToUpcapLimit
  implements Usecase<SendUserRevenueDataToUpcapLimitCommand, User> {
  constructor(
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.creditDecisioningService)
    private readonly creditDecisioningService: CreditDecisioningService,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: SendUserRevenueDataToUpcapLimitCommand): Promise<User> {
    const { banksUserId } = request;
    const user = await this.userRepository.findBy({ creditDecisioningUserId: banksUserId });
    this.userGateway.setCredentials(user.props.credential);

    // if oney users, not pp_de_reve
    // to-o add a check in auth
    const aggregatedBankAccounts = await this.bankAccountRepository.filterBy({
      aggregated: true,
      userId: user.props.userId,
    });

    const creditProfile = await this.creditDecisioningService.getBankUserCreditProfile(banksUserId);

    user.calculateRevenueData(aggregatedBankAccounts, creditProfile);

    await this.eventDispatcher.dispatch(user);
    return user;
  }
}
