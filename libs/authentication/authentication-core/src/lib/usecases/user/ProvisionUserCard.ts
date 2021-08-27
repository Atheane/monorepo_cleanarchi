import { inject, injectable, unmanaged } from 'inversify';
import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { CardProvisioningFailed, ProvisioningEventName } from '@oney/authentication-messages';
import { DomainError, MaybeType } from '@oney/common-core';
import { EventDispatcher, EventProducerDispatcher } from '@oney/messages-core';
import { AuthIdentifier } from '../AuthIdentifier';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { User, UserProperties } from '../../domain/aggregates/User';
import { ProvisioningErrorCause, RefAuthError, UserError } from '../../domain/models/AuthenticationError';
import { ProvisioningStep } from '../../domain/types/ProvisioningStep';
import { ProvisioningFunctionalErrorFactory } from '../../domain/factories/ProvisioningFunctionalErrorFactory';
import { CardGateway } from '../../domain/gateways/sca/CardGateway';
import { Provisioning } from '../../domain/valueobjects/Provisioning';
import { HashedCardPan } from '../../domain/valueobjects/HashedCardPan';
import { CardProvisioningGateway } from '../../domain/gateways/sca/CardProvisioningGateway';

export interface ProvisionUserCardCommand {
  cardId: string;
  userId: string;
  encryptedData: string;
}

interface UserInfo {
  uid: string;
  email: string;
}

@injectable()
export class ProvisionUserCard implements Usecase<ProvisionUserCardCommand, User> {
  constructor(
    @inject(AuthIdentifier.cardProvisioningGateway)
    private readonly _cardProvisioningGateway: CardProvisioningGateway,
    @inject(AuthIdentifier.userRepository) private readonly _userRepository: UserRepository,
    @inject(SymLogger) private readonly _logger: Logger,
    @inject(EventDispatcher) private readonly _eventDispatcher: EventDispatcher,
    @inject(EventProducerDispatcher) private readonly _eventProducerDispatcher: EventProducerDispatcher,
    @inject(AuthIdentifier.provisioningFunctionalErrorFactory)
    private readonly _provisioningFunctionalErrorFactory: ProvisioningFunctionalErrorFactory,
    @inject(AuthIdentifier.cardGateway) private readonly _cardGateway: CardGateway,
    @unmanaged() private readonly _refauthBaseUrl: string,
    @unmanaged() private readonly _recipient: string,
    @unmanaged() private readonly _companyCode: string,
  ) {}

  async execute({ userId, encryptedData }: ProvisionUserCardCommand): Promise<User> {
    let user: User;
    try {
      const maybeUser = await this._userRepository.getById(userId);
      if (maybeUser.type === MaybeType.Nothing) throw await this._sendUserErrorNotification(userId);
      user = maybeUser.value;
      const { primaryAccountNumber } = await this._cardGateway.decrypt(encryptedData);
      const cardProvisioning = Provisioning.from({
        partnerUid: `${this._companyCode}@${user.props.uid}`,
        step: ProvisioningStep.CARD,
      });
      user.provisionCard({ hashedCardPan: HashedCardPan.from(primaryAccountNumber), cardProvisioning });
      user = await this._cardProvisioningGateway.registerCard(user);
      await this._userRepository.save(user);
      await this._eventProducerDispatcher.dispatch(user);
      return user;
    } catch (error) {
      if (error.cause?.noCiphertext) throw await this._sendNoCardErrorNotification(error, user);
      if (error.cause?.errorResponse)
        throw await this._sendCardProvisioningErrorNotification(error.code, user);
      if (error.cause?.decryptionError) {
        const args: [UserProperties, string] = [user.props, error.message];
        const cardDataDecryptionError = new RefAuthError.ProvisionFailWithCardDataDecryptionError(...args);
        throw await this._handleCardDataDecryptionError(cardDataDecryptionError, user);
      }
      throw error;
    }
  }

  private async _sendUserErrorNotification(receivedUid: string): Promise<void> {
    const errorMessage = `User ID ${receivedUid} in event payload does not exist on authentication database`;
    const userError = new UserError.UserNotFound(errorMessage, { uid: receivedUid, responseCode: null });
    await this._handleUserError(userError);
  }

  private async _sendNoCardErrorNotification(e: Error, user: User): Promise<void> {
    const cardDataError = new RefAuthError.ProvisionFailWithCardDataDecryptionError(user.props, e.message);
    throw await this._handleCardDataDecryptionError(cardDataError, user);
  }

  private async _handleCardDataDecryptionError(cardDataError: DomainError, { props }: User): Promise<never> {
    this._logger.info(`[${props.uid}] Card data error with message: ${cardDataError.message}`);
    const userInfo: UserInfo = { uid: props.uid, email: props.email.address };
    await this._dispatchCardProvisioningError(cardDataError, userInfo);
    throw cardDataError;
  }

  private async _handleUserError(err: UserError.UserNotFound): Promise<never> {
    const userInfo = { uid: err.cause.uid, email: null, phone: null };
    await this._dispatchCardProvisioningError(err, userInfo);
    throw err;
  }

  private async _dispatchCardProvisioningError(e: DomainError, userInfo: UserInfo): Promise<void> {
    const notificationConfig = this._setCardProvisioningErrorNotificationConfig(e, userInfo);
    const notificationCardProvisioningFailed = new CardProvisioningFailed(notificationConfig);
    await this._eventDispatcher.dispatch(notificationCardProvisioningFailed);
    this._logger.info(`Dispatched ${ProvisioningEventName.CARD_PROVISIONING_FAILED} event`);
  }

  private _setCardProvisioningErrorNotificationConfig(e: DomainError, { uid, email }: UserInfo) {
    return {
      uid,
      email,
      recipient: this._recipient,
      step: ProvisioningStep.CARD,
      name: e.name,
      cause: e.cause,
      message: e.message,
      authBaseUrl: this._refauthBaseUrl,
      responseCode: (e.cause as ProvisioningErrorCause).responseCode,
    };
  }

  private async _sendCardProvisioningErrorNotification(code: string, user: User): Promise<void> {
    const cardProvisioningError = this._provisioningFunctionalErrorFactory.build(code, user);
    await this._handleCardProvisioningFunctionalError(cardProvisioningError, user);
  }

  private async _handleCardProvisioningFunctionalError(error: DomainError, { props }: User): Promise<never> {
    const userInfo: UserInfo = { uid: props.uid, email: props.email.address };
    await this._dispatchCardProvisioningError(error, userInfo);
    throw error;
  }
}
