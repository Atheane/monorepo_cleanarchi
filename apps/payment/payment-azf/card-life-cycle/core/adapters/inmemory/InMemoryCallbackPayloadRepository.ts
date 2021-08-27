import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { CallbackPayloadRepository } from '../../domain/repositories/CallbackPayloadRepository';
import { BankAccountRepository } from '../../domain/repositories/LegacyBankAccountRepository';
import { CallbackPayloadMapper } from '../mappers/CallbackPayloadMapper';
import { CallbackPayload } from '../types/CallbackPayload';
import { CallbackRequestPayload } from '../types/CallbackRequestPayload';

@injectable()
export class InMemoryCallbackPayloadRepository implements CallbackPayloadRepository {
  private callbackPayloadMapper: CallbackPayloadMapper;

  constructor(
    @inject(Identifiers.bankAccountRepository) private readonly bankAccountRepository: BankAccountRepository,
    private store: Map<string, CallbackPayload>,
  ) {
    this.callbackPayloadMapper = new CallbackPayloadMapper();
  }

  async save(callbackRequestPayload: CallbackRequestPayload): Promise<CallbackPayload> {
    const callbackPayload = this.callbackPayloadMapper.toDomain(callbackRequestPayload);

    // find related bank account
    const odbAccount = await this.bankAccountRepository.findByCardId(callbackPayload.reference);

    callbackPayload.userId = odbAccount.props.uid;

    this.store.set(callbackPayload.id, callbackPayload);

    return callbackPayload;
  }
}
