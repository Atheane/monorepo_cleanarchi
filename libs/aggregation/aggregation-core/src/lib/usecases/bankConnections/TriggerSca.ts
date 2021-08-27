import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { BankConnection } from '../../domain/aggregates/BankConnection';
import { UserGateway } from '../../domain/gateways/UserGateway';
import { ScaConnectionGateway } from '../../domain/gateways/ScaConnectionGateway';
import { BankConnectionError } from '../../domain/models/BankConnectionErrors';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';
import { ConnectionStateEnum } from '../../domain/valueobjects/ConnectionState';
import { RbacError } from '../../domain/models';

export interface TriggerScaCommand {
  userId: string;
  connectionId: string;
}

@injectable()
export class TriggerSca implements Usecase<TriggerScaCommand, BankConnection> {
  constructor(
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnection: BankConnectionRepository,
    @inject(AggregationIdentifier.scaConnectionGateway)
    private readonly scaConnectionGateway: ScaConnectionGateway,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnectionRepository: BankConnectionRepository,
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

  async execute(request: TriggerScaCommand): Promise<BankConnection> {
    const { connectionId } = request;

    const connection = await this.bankConnection.findBy({ connectionId });

    switch (connection.props.state) {
      case ConnectionStateEnum.SCA:
        break;
      case ConnectionStateEnum.MORE_INFORMATION:
        return connection;
      case ConnectionStateEnum.DECOUPLED:
        return connection;
      default:
        throw new BankConnectionError.NoScaRequired();
    }

    const user = await this.userRepository.findBy({ userId: connection.props.userId });
    // auth requests
    this.userGateway.setCredentials(user.props.credential);

    const updatedConnection = await this.scaConnectionGateway.triggerSca(connection);
    updatedConnection.updateConnection(updatedConnection.props.state);
    await this.eventDispatcher.dispatch(updatedConnection);
    return this.bankConnectionRepository.save(updatedConnection.props);
  }
}
