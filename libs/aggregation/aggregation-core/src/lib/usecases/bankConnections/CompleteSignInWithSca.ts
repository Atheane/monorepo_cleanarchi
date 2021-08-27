import { Usecase } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { AggregationIdentifier } from '../../AggregationIdentifier';
import {
  BankConnection,
  BankConnectionError,
  UserRepository,
  BankConnectionRepository,
  ScaConnectionGateway,
  UserGateway,
  ConnectionStateEnum,
  ISigninField,
  UrlCallBack,
} from '../../domain';
import { RbacError } from '../../domain/models';

export interface CompleteSignInWithScaCommand {
  connectionId: string;
  form?: ISigninField[];
  userId: string;
}

@injectable()
export class CompleteSignInWithSca implements Usecase<CompleteSignInWithScaCommand, BankConnection> {
  constructor(
    @inject(AggregationIdentifier.bankConnectionRepository)
    private readonly banksConnectionRepository: BankConnectionRepository,
    @inject(AggregationIdentifier.userGateway)
    private readonly userGateway: UserGateway,
    @inject(AggregationIdentifier.userRepository)
    private readonly userRepository: UserRepository,
    @inject(AggregationIdentifier.scaConnectionGateway)
    private readonly scaConnectionGateway: ScaConnectionGateway,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
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

  async execute(request: CompleteSignInWithScaCommand): Promise<BankConnection> {
    const { connectionId, userId, form } = request;
    const user = await this.userRepository.findBy({ userId });

    const scaInWebApp = form?.find(field => field.name === 'url_callback');

    if (scaInWebApp) {
      new UrlCallBack(form).validate();
    }

    // authenticate requests
    this.userGateway.setCredentials(user.props.credential);

    let connection = await this.banksConnectionRepository.findBy({ connectionId });
    if (connection.props.state === ConnectionStateEnum.MORE_INFORMATION) {
      connection = await this.scaConnectionGateway.authenticateOtp(connection, form);
      return this.banksConnectionRepository.save(connection.props);
    } else if (connection.props.state === ConnectionStateEnum.DECOUPLED) {
      connection.props.state = ConnectionStateEnum.VALIDATING;
      const promiseBankConnection = this.scaConnectionGateway.authenticateThirdParty(connection);
      promiseBankConnection
        .then(
          async (result: BankConnection): Promise<void> => {
            connection.finishThirdPartyAuth(result.props.state);
            connection.updateConnection(result.props.state);
            await this.eventDispatcher.dispatch(connection);
            await this.banksConnectionRepository.save(connection.props);
            if (scaInWebApp) {
              await this.scaConnectionGateway.postScaResult(connection, new UrlCallBack(form).value);
            }
          },
        )
        .catch(error => {
          defaultLogger.error('CompleteSignInWithSca', error);
          throw error;
        });
      return connection;
    } else {
      throw new BankConnectionError.NoScaRequired(connection.props);
    }
  }
}
