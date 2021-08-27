import { Usecase } from '@oney/ddd';
import { inject, injectable, unmanaged } from 'inversify';
import { DomainError, MaybeType } from '@oney/common-core';
import {
  PhoneProvisioningFailed,
  PhoneProvisioningFailedProperties,
  ProvisioningStep,
} from '@oney/authentication-messages';
import { Logger, SymLogger } from '@oney/logger-core';
import { EventDispatcher, EventProducerDispatcher } from '@oney/messages-core';
import { AuthRequestHandler } from '../../domain/handlers/AuthRequestHandler';
import { ProvisioningErrorCause, RefAuthError, UserError } from '../../domain/models/AuthenticationError';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { AuthIdentifier } from '../AuthIdentifier';
import { User } from '../../domain/aggregates/User';
import { ProvisioningFunctionalErrorFactory } from '../../domain/factories/ProvisioningFunctionalErrorFactory';
import { ProvisioningStep as coreProvStep } from '../../domain/types/ProvisioningStep';
import { Provisioning } from '../../domain/valueobjects/Provisioning';
import { PhoneProvisioningGateway } from '../../domain/gateways/sca/PhoneProvisioningGateway';

export interface ProvisionUserPhoneCommand {
  phone: string;
  userId: string;
  useIcgSmsAuthFactor: boolean;
}

interface UserInfo {
  uid: string;
  email: string;
  phone: string;
}

@injectable()
export class ProvisionUserPhone implements Usecase<ProvisionUserPhoneCommand, User> {
  constructor(
    @inject(AuthIdentifier.userRepository) private readonly _userRepository: UserRepository,
    @inject(AuthIdentifier.authRequestHandler) private readonly _authRequestHandler: AuthRequestHandler,
    @inject(SymLogger) private readonly _logger: Logger,
    @inject(EventDispatcher) private readonly _eventDispatcher: EventDispatcher,
    @inject(EventProducerDispatcher) private readonly _eventProducerDispatcher: EventProducerDispatcher,
    @inject(AuthIdentifier.provisioningFunctionalErrorFactory)
    private readonly _provisioningFunctionalErrorFactory: ProvisioningFunctionalErrorFactory,
    @inject(AuthIdentifier.phoneProvisioningGateway)
    private readonly _phoneProvisioningGateway: PhoneProvisioningGateway,
    @unmanaged() private readonly _provisioningBaseUrl: string,
    @unmanaged() private readonly _recipient: string,
    @unmanaged() private readonly _companyCode: string,
  ) {}

  async execute(request: ProvisionUserPhoneCommand): Promise<User> {
    let user: User;
    try {
      this._logger.info(`Sms auth factor set to: ${request.useIcgSmsAuthFactor}`);
      const maybeUser = await this._userRepository.getById(request.userId);
      if (maybeUser.type === MaybeType.Nothing) throw await this._sendUserErrorNotification(request.userId);
      user = maybeUser.value;
      const phoneProvisioning = Provisioning.from({
        partnerUid: `${this._companyCode}@${user.props.uid}`,
        step: coreProvStep.PHONE,
      });
      user.provisionPhone({ phone: request.phone, phoneProvisioning });
      await this._phoneProvisioningGateway.registerPhone(user);
      await this._userRepository.save(user);
      await this._eventProducerDispatcher.dispatch(user);
      return user;
    } catch (error) {
      if (error.cause?.user && error.cause?.code) {
        const { user, code, codeName } = error.cause;
        throw await this._sendProvisionFailNotification(code, codeName, user);
      }
      throw await this._handleTransientError(error, user);
    }
  }

  private async _sendUserErrorNotification(receivedUid: string): Promise<never> {
    const userNotFoundError = new UserError.UserNotFound(`Uid ${receivedUid} in event does not exist`);
    await this._handleUserError(receivedUid, userNotFoundError);
    throw userNotFoundError;
  }

  private async _handleUserError(receivedUid: string, userNotFoundError: DomainError): Promise<void> {
    const userInfo = { uid: receivedUid, email: null, phone: null };
    const notificationConfig = this._setPhoneProvisioningErrorNotificationConfig(userInfo, userNotFoundError);
    await this._dispatchUserErrorNotification(notificationConfig);
  }

  private _setPhoneProvisioningErrorNotificationConfig(
    { uid, email, phone }: UserInfo,
    domainErr: DomainError,
  ): PhoneProvisioningFailedProperties {
    return {
      uid,
      email,
      phone,
      recipient: this._recipient,
      step: ProvisioningStep.PHONE,
      name: domainErr.name,
      cause: domainErr.cause,
      message: domainErr.message,
      authBaseUrl: this._provisioningBaseUrl,
      responseCode: (domainErr.cause as ProvisioningErrorCause).responseCode,
    };
  }

  private async _dispatchUserErrorNotification(
    notificationConfig: PhoneProvisioningFailedProperties,
  ): Promise<void> {
    const notificationPhoneProvisioningFailed = new PhoneProvisioningFailed({ ...notificationConfig });
    await this._eventDispatcher.dispatch(notificationPhoneProvisioningFailed);
  }

  private async _sendProvisionFailNotification(code: string, codeName: string, user: User): Promise<never> {
    const provisioningError = this._provisioningFunctionalErrorFactory.build(code, user);
    await this._dispatchPrrovisiongErrorNotification(user, provisioningError);
    this._logger.info(`[${user.props.uid}] Failed phone provisioning with error: ${codeName}`);
    throw provisioningError;
  }

  private async _handleTransientError(error: Error, user: User): Promise<never> {
    this._logger.info(`[${user.props.uid}] Handling error while provision phone: ${error.message}`);
    const transientError = new RefAuthError.ProvisionFailTransientError(user.props, error.message);
    await this._dispatchPrrovisiongErrorNotification(user, transientError);
    throw transientError;
  }

  private async _dispatchPrrovisiongErrorNotification(
    { props }: User,
    provisioningError: DomainError,
  ): Promise<void> {
    const userInfo: UserInfo = { uid: props.uid, email: props.email.address, phone: props.phone };
    const notificationConfig = this._setPhoneProvisioningErrorNotificationConfig(userInfo, provisioningError);
    const notificationPhoneProvisioningFailed = new PhoneProvisioningFailed({ ...notificationConfig });
    await this._eventDispatcher.dispatch(notificationPhoneProvisioningFailed);
  }
}
