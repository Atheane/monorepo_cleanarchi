import { Mapper } from '@oney/common-core';
import {
  EventActionCodes,
  EventCallbackTypes,
  EventCardStatuses,
  EventCardTypes,
  EventOpposedReason,
} from '@oney/payment-messages';
import { OdbEventStoreDocument } from '../mongodb/models/CardLifecycleCallbackPayloadModel';
import { CallbackPayload } from '../types/CallbackPayload';
import { CallbackRequestPayload } from '../types/CallbackRequestPayload';

function isCallbackRequestPayload(payload: any): payload is CallbackRequestPayload {
  // accept value 0
  return payload.action >= 0;
}

export class CallbackPayloadMapper implements Mapper<CallbackPayload> {
  toDomain(raw: CallbackRequestPayload | OdbEventStoreDocument): CallbackPayload {
    return {
      id: isCallbackRequestPayload(raw) ? `${raw.id}` : raw.data.id,
      date: isCallbackRequestPayload(raw) ? new Date() : raw.date,
      reference: isCallbackRequestPayload(raw) ? raw.reference : raw.data.reference,
      type: EventCallbackTypes[raw.type],
      cardType: isCallbackRequestPayload(raw)
        ? EventCardTypes[raw.cardType]
        : EventCardTypes[raw.data.cardType],
      actionCode: isCallbackRequestPayload(raw)
        ? EventActionCodes[raw.action]
        : EventActionCodes[raw.data.actionCode],
      status: isCallbackRequestPayload(raw)
        ? EventCardStatuses[raw.status]
        : EventCardStatuses[raw.data.status],
      opposedReason: isCallbackRequestPayload(raw)
        ? EventOpposedReason[raw.opposedReason]
        : EventOpposedReason[raw.data.opposedReason],
      userId: isCallbackRequestPayload(raw) ? '' : raw.data.userId,
    };
  }

  fromDomain(t: CallbackPayload): OdbEventStoreDocument {
    const { id, reference, actionCode, cardType, status, type, date, opposedReason, userId } = t;

    return {
      type: EventCallbackTypes[type].toString(),
      date,
      data: {
        id,
        reference,
        type: EventCallbackTypes[type].toString(),
        actionCode: EventActionCodes[actionCode].toString(),
        cardType: EventCardTypes[cardType].toString(),
        status: EventCardStatuses[status].toString(),
        opposedReason: EventOpposedReason[opposedReason].toString(),
        userId,
      },
    };
  }
}
