import { Usecase } from '@oney/ddd';
import {
  CallbackType,
  COPReceived,
  DiligenceSctInReceived,
  EkycUpdated,
  LcbFtUpdated,
  SDDReceived,
  ClearingBatchReceived,
} from '@oney/payment-messages';
import { EventDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { DispatcherError } from '../../models/errors/PaymentErrors';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { DiligenceSctInCallbackPayload } from '../../domain/valueobjects/callbacks/DiligenceSctInCallbackPayload';
import { EkycCallbackPayload } from '../../domain/valueobjects/callbacks/EkycCallbackPayload';
import { LcbFtCallbackPayload } from '../../domain/valueobjects/callbacks/LcbFtCallbackPayload';
import { RawCallbackPayload } from '../../domain/entities/RawCallbackPayload';
import { CallbackPayloadRepository } from '../../domain/repository/eventstore/CallbackPayloadRepository';
import { SDDCallbackPayload } from '../../domain/valueobjects/callbacks/SDDCallbackPayload';
import { ClearingBatchCallbackPayload } from '../../domain/valueobjects/callbacks/ClearingBatchCallbackPayload';
import { COPCallbackPayload } from '../../domain/valueobjects/callbacks/COPCallbackPayload';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class RawCallbackRequest<T = any> {
  payload: T;
}

@injectable()
export class DispatchHooks implements Usecase<RawCallbackRequest, void> {
  constructor(
    @inject(PaymentIdentifier.callbackPayloadRepository)
    private readonly callbackPayloadRepository: CallbackPayloadRepository,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(request: RawCallbackRequest): Promise<void> {
    if (!request.payload) {
      throw new DispatcherError.PayloadNotFound();
    }
    // As S-Money is sending both string and int type, we ensure the type we are using is CallbackType
    const callbackType: CallbackType = request.payload.type
      ? request.payload.type.toString()
      : request.payload.Type.toString();
    const callbackPayload = new RawCallbackPayload({
      id: uuidv4(),
      type: callbackType,
      date: new Date(),
      data: {
        ...request.payload,
        type: callbackType, // Necessary to avoid SMONEY schema inconsistency about `type` js type and case
      },
    });
    const savedRawPayload = await this.callbackPayloadRepository.save(callbackPayload);

    switch (callbackType) {
      case CallbackType.EKYC:
        const ekycCallbackPayload = new EkycCallbackPayload(savedRawPayload.props.data);
        await ekycCallbackPayload.sanitize();
        await this.eventDispatcher.dispatch(new EkycUpdated(ekycCallbackPayload.props));
        break;
      case CallbackType.DILIGENCE_SCT_IN:
        const diligenceSctInCallbackPayload = new DiligenceSctInCallbackPayload(savedRawPayload.props.data);
        await diligenceSctInCallbackPayload.sanitize();
        await this.eventDispatcher.dispatch(new DiligenceSctInReceived(diligenceSctInCallbackPayload.props));
        break;
      case CallbackType.LCB_FT:
        const lcbFtCallbackPayload = new LcbFtCallbackPayload(savedRawPayload.props.data);
        await lcbFtCallbackPayload.sanitize();
        await this.eventDispatcher.dispatch(new LcbFtUpdated(lcbFtCallbackPayload.props));
        break;
      case CallbackType.SDD:
        const sddCallbackPayload = new SDDCallbackPayload(savedRawPayload.props.data);
        await sddCallbackPayload.sanitize();
        await this.eventDispatcher.dispatch(new SDDReceived(sddCallbackPayload.props));
        break;
      case CallbackType.CARD_OPERATION:
        const copCallbackPayload = new COPCallbackPayload(savedRawPayload.props.data);
        await copCallbackPayload.sanitize();
        await this.eventDispatcher.dispatch(new COPReceived(copCallbackPayload.props));
        break;
      case CallbackType.CLEARING_BATCH:
        const clearingBatchCallbackPayload = new ClearingBatchCallbackPayload(savedRawPayload.props.data);
        await clearingBatchCallbackPayload.sanitize();
        await this.eventDispatcher.dispatch(new ClearingBatchReceived(clearingBatchCallbackPayload.props));
        break;
      default:
        throw new DispatcherError.CallbackNotSupported(request.payload);
    }
  }
}
