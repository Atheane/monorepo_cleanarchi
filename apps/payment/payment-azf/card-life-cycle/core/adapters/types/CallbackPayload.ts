import {
  EventActionCodesKey,
  EventCallbackTypesKey,
  EventCardStatusesKey,
  EventCardTypesKey,
  EventOpposedReasonKey,
} from '@oney/payment-messages';

export interface CallbackPayload {
  id: string;
  date: Date;
  reference: string;
  type: EventCallbackTypesKey;
  cardType: EventCardTypesKey;
  actionCode: EventActionCodesKey;
  status: EventCardStatusesKey;
  opposedReason: EventOpposedReasonKey;
  userId: string;
}
