import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import { BankConnection } from '../../domain/aggregates/BankConnection';
import { UserGateway } from '../../domain/gateways/UserGateway';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { BankConnectionRepository } from '../../domain/repositories/BankConnectionRepository';
import { RbacError } from '../../domain/models';
import { ISigninField } from '../../domain/types/ISigninField';
import { BankConnectionGateway } from '../../domain';
import { BankRepository } from '../../domain/repositories/BankRepository';

export interface UpdateConnectionCommand {
  userId: string;
  connectionId: string;
  bankId: string;
  form: ISigninField[];
}

@injectable()
export class UpdateConnection implements Usecase<UpdateConnectionCommand, BankConnection> {
  constructor(
    @inject(AggregationIdentifier.bankRepository) private readonly bankRepository: BankRepository,
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly bankConnection: BankConnectionRepository,
    @inject(AggregationIdentifier.bankConnectionGateway)
    private readonly bankConnectionGateway: BankConnectionGateway,
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

  async execute(request: UpdateConnectionCommand): Promise<BankConnection> {
    const { connectionId, form, bankId } = request;

    await this.bankRepository.getById(bankId);
    const bankConnection = await this.bankConnection.findBy({ connectionId });

    const user = await this.userRepository.findBy({ userId: bankConnection.props.userId });
    // auth requests
    this.userGateway.setCredentials(user.props.credential);

    const updatedConnection = await this.bankConnectionGateway.updateConnection({ bankConnection, form });
    updatedConnection.updateConnection(updatedConnection.props.state);
    await this.eventDispatcher.dispatch(updatedConnection);
    return this.bankConnectionRepository.save(updatedConnection.props);
  }
}
