import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { EventDispatcher } from '@oney/messages-core';
import { CardSent, CardStatusUpdateReceived, EventCardStatuses } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { CallbackPayload } from '../adapters/types/CallbackPayload';
import { CallbackRequestPayload } from '../adapters/types/CallbackRequestPayload';
import { Identifiers } from '../di/Identifiers';
import { EncryptedPanGateway } from '../domain/gateways/EncryptedPanGateway';
import { CardLifecycleCallbackError } from '../domain/models/DomainError';
import { CallbackPayloadRepository } from '../domain/repositories/CallbackPayloadRepository';

@injectable()
export class ProcessCardLifecycleCallback implements Usecase<CallbackRequestPayload, CallbackPayload> {
  constructor(
    @inject(Identifiers.callbackPayloadRepository)
    private readonly callbackPayloadRepository: CallbackPayloadRepository,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
    @inject(Identifiers.encryptedPanGateway) private readonly encryptedPanGateway: EncryptedPanGateway,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {}

  async execute(request: CallbackRequestPayload): Promise<CallbackPayload> {
    console.log(`Received request in process card lifecycle callback use case: ${JSON.stringify(request)}`);

    if (!request) {
      this._logger.info(`Entering case when no callback payload received in use case`);
      throw new CardLifecycleCallbackError.PayloadNotFound(`Invalid payload ${request}`);
    }

    const savedCallbackPayload = await this.callbackPayloadRepository.save(request);
    this._logger.info(`Saved callnack payload, in use case: ${JSON.stringify(savedCallbackPayload)}`);

    const event = new CardStatusUpdateReceived(savedCallbackPayload);
    await this.eventDispatcher.dispatch(event);
    this._logger.info(`Dispatched CARD_STATUS_UPDATE_RECEIVED event`);

    if (savedCallbackPayload.status === EventCardStatuses[EventCardStatuses.SENT]) {
      this._logger.info(
        `Entering case when callback payload status is set to SENT (${EventCardStatuses.SENT})`,
      );

      const encryptedPan64 = await this.encryptedPanGateway.getEncryptedPan(savedCallbackPayload);
      this._logger.info(`Retrieved encrypted card data in use case: ${encryptedPan64.substring(0, 10)}...`);

      const event = new CardSent({
        encryptedData: encryptedPan64,
        cardId: savedCallbackPayload.reference,
        userId: savedCallbackPayload.userId,
      });
      await this.eventDispatcher.dispatch(event);
      this._logger.info(`Dispatched CARD_SENT event`);
    }

    return savedCallbackPayload;
  }
}
