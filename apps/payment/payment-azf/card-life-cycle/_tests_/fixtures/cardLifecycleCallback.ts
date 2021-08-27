import {
  EventActionCodes,
  EventCallbackTypes,
  EventCardStatuses,
  EventCardTypes,
  EventOpposedReason,
} from '@oney/payment-messages';
import { LegacyBankAccount } from '../../core/domain/entities/LegacyBankAccount';

export const callbackId = 12345;
const cardReference = 'card-mX0N2fSSw';

export const mockLegacyBankAccountAccountProperties = {
  uid: 'cobVj_Wq3',
  bid: '3154',
  iban: 'FR2212869000020PC000002F879',
  bic: 'BACCFR44',
  cards: [
    {
      cid: cardReference,
      pan: '9396XXXXXXXX6931',
      status: 1,
      cardType: 4,
      blocked: false,
      foreignPayment: true,
      internetPayment: true,
      atmWeeklyAllowance: 5,
      atmWeeklyUsedAllowance: 0,
      monthlyAllowance: 50,
      monthlyUsedAllowance: 0,
      hasPin: true,
      uniqueId: '1286900002EkOotOYhDk6z2qm3JxT5nA',
    },
  ],
  beneficiary: [],
};
export const mockLegacyBankAccountAccount = new LegacyBankAccount(mockLegacyBankAccountAccountProperties);

export default {
  body: {
    id: callbackId,
    action: EventActionCodes.CREATION,
    cardType: EventCardTypes.CLASSIC_PHYSICAL,
    reference: cardReference,
    status: EventCardStatuses.ORDERED,
    type: EventCallbackTypes.CARD_LIFECYCLE,
    opposedReason: EventOpposedReason.NO_OPPOSITION,
  },
  bodyWithStatusSent: {
    id: 23456,
    action: EventActionCodes.UPDATE,
    cardType: EventCardTypes.CLASSIC_PHYSICAL,
    reference: cardReference,
    status: EventCardStatuses.SENT,
    type: EventCallbackTypes.CARD_LIFECYCLE,
    opposedReason: EventOpposedReason.NO_OPPOSITION,
  },
};
