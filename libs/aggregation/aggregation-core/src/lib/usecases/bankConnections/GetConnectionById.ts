import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { UserRepository, UserGateway } from '../../domain';
import { BankConnection } from '../../domain/aggregates/BankConnection';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';
import { RbacError } from '../../domain/models';

export interface GetConnectionByIdCommand {
  userId: string;
  connectionId: string;
}

@injectable()
export class GetConnectionById implements Usecase<GetConnectionByIdCommand, BankConnection> {
  constructor(
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,

    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,

    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly banksConnectionRepository: BankConnectionRepository,
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

  async execute(request: GetConnectionByIdCommand): Promise<BankConnection> {
    const { userId, connectionId } = request;
    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);
    return this.banksConnectionRepository.findBy({ connectionId });
  }
}
