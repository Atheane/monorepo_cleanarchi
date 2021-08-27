import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  UserRepository,
  CreditProfile,
  CreditDecisioningService,
  CreditDecisioningError,
  RbacError,
} from '../../domain';

export interface GetUserCreditProfileCommands {
  userId: string;
}

@injectable()
export class GetUserCreditProfile implements Usecase<GetUserCreditProfileCommands, CreditProfile> {
  constructor(
    @inject(AggregationIdentifier.creditDecisioningService)
    private readonly creditDecisioningService: CreditDecisioningService,
    @inject(AggregationIdentifier.userRepository)
    private userRepository: UserRepository,
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

  async execute(request: GetUserCreditProfileCommands): Promise<CreditProfile> {
    const { userId } = request;
    const user = await this.userRepository.findBy({ userId });
    if (!user.props.creditDecisioningUserId) throw new CreditDecisioningError.UserUnknown();
    return this.creditDecisioningService.getBankUserCreditProfile(user.props.creditDecisioningUserId);
  }
}
