import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { ConnectionStateEnum, ScaConnectionGateway } from '../../domain';
import { User } from '../../domain/aggregates/User';
import { BankConnection } from '../../domain/aggregates/BankConnection';
import { BankConnectionGateway } from '../../domain/gateways/BankConnectionGateway';
import { UserGateway } from '../../domain/gateways/UserGateway';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';
import { BankRepository } from '../../domain/repositories/BankRepository';
import { ISigninField } from '../../domain/types/ISigninField';
import { RbacError } from '../../domain/models';

export interface SignInCommand {
  bankId: string;
  form: ISigninField[];
  userId: string;
}

@injectable()
export class SignIn implements Usecase<SignInCommand, BankConnection> {
  constructor(
    @inject(AggregationIdentifier.bankRepository) private readonly bankRepository: BankRepository,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly banksConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.bankConnectionGateway)
    private readonly bankConnectionGateway: BankConnectionGateway,
    @inject(AggregationIdentifier.scaConnectionGateway)
    private readonly scaConnectionGateway: ScaConnectionGateway,
    @inject(EventProducerDispatcher)
    private readonly eventDispatcher: EventProducerDispatcher,
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

  async execute(request: SignInCommand): Promise<BankConnection> {
    const { bankId, form, userId } = request;
    const bank = await this.bankRepository.getById(bankId);

    let user: User = await this.userRepository.findBy({ userId });
    if (!user.props.credential) {
      // first connection
      const credential = await this.userGateway.getNewCredentials();
      user.update({ credential });
      user = await this.userRepository.update(userId, { credential });
    }

    // authenticate requests
    this.userGateway.setCredentials(user.props.credential);

    let connection = await this.bankConnectionGateway.askConnection(bank.uid, user.props.userId, form);

    // if user killed app during a third party auth and retry signin
    if (connection.props.state === ConnectionStateEnum.SCA) {
      connection = await this.scaConnectionGateway.triggerSca(connection);
    }

    // check if connection already exists
    try {
      const existingConnection = await this.banksConnectionRepository.findBy({
        refId: connection.props.refId,
      });
      existingConnection.updateConnection(connection.props.state);
      await this.eventDispatcher.dispatch(existingConnection);
      return this.banksConnectionRepository.save(existingConnection.props);
    } catch (e) {
      return this.banksConnectionRepository.save(connection.props);
    }
  }
}
