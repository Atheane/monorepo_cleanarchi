import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { injectable, inject } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  User,
  UserRepository,
  Transaction,
  CreditDecisioningError,
  CreditDecisioningService,
  RbacError,
} from '../../domain';

export interface GetCategorizedTransactionsCommand {
  userId: string;
}

@injectable()
export class GetCategorizedTransactions implements Usecase<GetCategorizedTransactionsCommand, Transaction[]> {
  constructor(
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.creditDecisioningService)
    private readonly creditDecisioningService: CreditDecisioningService,
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

  async execute(request: GetCategorizedTransactionsCommand): Promise<Transaction[]> {
    const { userId } = request;
    const user: User = await this.userRepository.findBy({ userId });
    if (!user.props.creditDecisioningUserId) throw new CreditDecisioningError.UserUnknown();
    return this.creditDecisioningService.getCategorizedTransactions(user.props.creditDecisioningUserId);
  }
}
