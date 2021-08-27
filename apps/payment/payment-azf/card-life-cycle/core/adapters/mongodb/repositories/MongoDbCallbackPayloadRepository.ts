import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { CallbackPayloadRepository } from '../../../domain/repositories/CallbackPayloadRepository';
import { BankAccountRepository } from '../../../domain/repositories/LegacyBankAccountRepository';
import { CallbackPayloadMapper } from '../../mappers/CallbackPayloadMapper';
import { CallbackPayload } from '../../types/CallbackPayload';
import { CallbackRequestPayload } from '../../types/CallbackRequestPayload';
import { CardLifecycleCallbackPayloadModel } from '../models/CardLifecycleCallbackPayloadModel';

@injectable()
export class MongoDbCallbackPayloadRepository implements CallbackPayloadRepository {
  private cardLifecycleCallbackPayloadModel = CardLifecycleCallbackPayloadModel;

  private callbackPayloadMapper: CallbackPayloadMapper;

  constructor(
    @inject(Identifiers.bankAccountRepository) private readonly bankAccountRepository: BankAccountRepository,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    this.callbackPayloadMapper = new CallbackPayloadMapper();
  }

  async save(callbackRequestPayload: CallbackRequestPayload): Promise<CallbackPayload> {
    const callbackPayload = this.callbackPayloadMapper.toDomain(callbackRequestPayload);
    this._logger.info(`Mapped callback payload to domain object: ${JSON.stringify(callbackPayload)}`);

    // find related bank account
    const odbAccount = await this.bankAccountRepository.findByCardId(callbackPayload.reference);
    this._logger.info(
      `Retrieved odb account associated to reference ${
        callbackPayload.reference
      } in callback payload: ${JSON.stringify(odbAccount)}`,
    );

    callbackPayload.userId = odbAccount.props.uid;
    this._logger.info(
      `Set userId field to ${callbackPayload.userId} in callback payload domain object: ${JSON.stringify(
        callbackPayload,
      )}`,
    );

    const callbackPayloadDto = this.callbackPayloadMapper.fromDomain(callbackPayload);

    const callbackPayloadInstance = new this.cardLifecycleCallbackPayloadModel(callbackPayloadDto);
    const result = await callbackPayloadInstance.save();
    this._logger.info(`Retrieved raw callback payload saved in event store: ${JSON.stringify(result)}`);

    return this.callbackPayloadMapper.toDomain(result);
  }
}
