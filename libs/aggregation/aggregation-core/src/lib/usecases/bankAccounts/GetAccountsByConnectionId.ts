import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  BankRepository,
  Bank,
  BankConnectionRepository,
  BankAccount,
  BankAccountRepository,
  UserRepository,
  UserGateway,
  RbacError,
  BankAccountGateway,
} from '../../domain';

export interface GetAccountsByConnectionIdCommands {
  userId: string;
  connectionId: string;
}

@injectable()
export class GetAccountsByConnectionId
  implements
    Usecase<GetAccountsByConnectionIdCommands, Promise<{ bankAccounts: BankAccount[]; bank: Bank }>> {
  constructor(
    @inject(AggregationIdentifier.bankAccountRepository)
    private readonly bankAccountRepository: BankAccountRepository,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.bankRepository)
    private readonly bankRepository: BankRepository,
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
    request: GetAccountsByConnectionIdCommands,
  ): Promise<{ bankAccounts: BankAccount[]; bank: Bank }> {
    const { userId, connectionId } = request;

    // authenticate request
    const user = await this.userRepository.findBy({ userId });
    this.userGateway.setCredentials(user.props.credential);
    const connection = await this.bankConnectionRepository.findBy({ connectionId });
    const bank = await this.bankRepository.getById(connection.props.bankId);
    const bankAccounts = await this.bankAccountGateway.getAccountsFromRefId(connection.props.refId);
    return { bankAccounts, bank };
  }
}
