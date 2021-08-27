import { DiligencesType, DiligenceStatus, RawCallbackRequest } from '@oney/payment-core';
import { CallbackType } from '@oney/payment-messages';

export const callbackId = '12345';

export const kycPayload: RawCallbackRequest = {
  payload: {
    type: CallbackType.EKYC,
    id: callbackId,
    status: 'Complete',
    userId: 'GGSGMMC01',
    diligences: [
      {
        reason: null,
        type: DiligencesType.PASSPORT,
        status: DiligenceStatus.VALIDATED,
      },
      {
        reason: null,
        type: DiligencesType.AGGREGATION,
        status: DiligenceStatus.VALIDATED,
      },
    ],
  },
};

export const kycBrokenPayload: RawCallbackRequest = {
  payload: {
    type: CallbackType.EKYC,
    id: callbackId,
    status: 1,
    userId: 'GGSGMMC01',
    diligences: [
      {
        reason: null,
        type: DiligencesType.PASSPORT,
        status: DiligenceStatus.VALIDATED,
      },
      {
        reason: null,
        type: DiligencesType.AGGREGATION,
        status: DiligenceStatus.VALIDATED,
      },
    ],
  },
};

export const diligenceSctInPayload: RawCallbackRequest = {
  payload: {
    type: '31',
    status: 'Validated',
    appUserId: '439468e3J',
    diligenceType: 'SCTIN',
    amount: 100,
    transferDate: '2020-07-03T22:00:00+00:00',
    transmitterFullname: 'Jess Donnelly',
  },
};

export const diligenceSctInBrokenPayload: RawCallbackRequest = {
  payload: {
    type: '31',
    status: 'Unknown',
    appUserId: '439468e3J',
    diligenceType: 'SCTIN',
    amount: 100,
    transferDate: '2020-07-03T22:00:00+00:00',
    transmitterFullname: 'Jess Donnelly',
  },
};

export const lcbFtPayload: RawCallbackRequest = {
  payload: {
    type: '32',
    appUserId: 'test_1234',
    riskLevel: 'High',
    eventDate: '2020-07-03T22:00:00+00:00',
  },
};

export const lcbFtBrokenPayload: RawCallbackRequest = {
  payload: {
    type: '32',
    appUserId: 'test_1234',
    riskLevel: 'High',
    eventDate: new Date(),
  },
};

export const unsupportedPayload: RawCallbackRequest = {
  payload: {
    type: '999999',
  },
};

export const kycUpdatedDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    diligences: [
      { reason: null, status: 'Validated', type: 'PASSPORT' },
      { reason: null, status: 'Validated', type: 'ACC_AGG' },
    ],
    id: '12345',
    status: 'Complete',
    type: '4',
    userId: 'GGSGMMC01',
  },
};

export const diligenceSctInReceivedDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    amount: 100,
    appUserId: '439468e3J',
    diligenceType: 'SCTIN',
    status: 'Validated',
    transferDate: '2020-07-03T22:00:00+00:00',
    transmitterFullname: 'Jess Donnelly',
    type: '31',
  },
};

export const lcbFtUpdateDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    appUserId: 'test_1234',
    eventDate: '2020-07-03T22:00:00+00:00',
    riskLevel: 'High',
    type: '32',
  },
};

export const sddInPayload: RawCallbackRequest = {
  payload: {
    id: '6563',
    reference: 'S-MONEY-20200915141600000102',
    type: '19',
    status: '1',
    userid: 'sandboxing',
  },
};

export const sddBrokenPayload: RawCallbackRequest = {
  payload: {
    id: '6563',
    reference: 'S-MONEY-20200915141600000102',
    type: '19',
    status: '1',
    userid: 123456,
  },
};

export const sddReceivedDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    id: '6563',
    reference: 'S-MONEY-20200915141600000102',
    status: '1',
    type: '19',
    userid: 'sandboxing',
  },
};

export const copPayload: RawCallbackRequest = {
  payload: {
    id: '11644',
    reference: 'ayozulrytUiGsN_Jr94dFQ',
    type: '20',
    transactionAmount: '15',
    currencyCodeTransaction: '978',
    cardHolderBillingAmount: '',
    cardHolderBillingConversionRate: '',
    availableBalance: '1263.12',
    actionCode: '0',
    merchantType: '5812',
    cardAcceptorIdentificationCodeName: 'Chez Francette\\\\Paris 11',
    status: '0',
    userId: 'cmOMKSApM',
  },
};

export const copBrokenPayload: RawCallbackRequest = {
  payload: {
    id: '11644',
    type: '20',
    transactionAmount: '15',
    currencyCodeTransaction: 978,
    cardHolderBillingAmount: '',
    cardHolderBillingConversionRate: '',
    availableBalance: '1263.12',
    actionCode: '0',
    merchantType: '5812',
    cardAcceptorIdentificationCodeName: 'Chez Francette\\\\Paris 11',
    status: '0',
    userId: 'cmOMKSApM',
  },
};

export const copReceivedDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    actionCode: '0',
    availableBalance: '1263.12',
    cardAcceptorIdentificationCodeName: 'Chez Francette\\\\Paris 11',
    cardHolderBillingAmount: '',
    cardHolderBillingConversionRate: '',
    currencyCodeTransaction: '978',
    id: '11644',
    merchantType: '5812',
    reference: 'ayozulrytUiGsN_Jr94dFQ',
    status: '0',
    transactionAmount: '15',
    type: '20',
    userId: 'cmOMKSApM',
  },
};

export const clearingBatchPayload: RawCallbackRequest = {
  payload: {
    id: '900',
    reference: '900',
    type: '24',
  },
};

export const clearingBatchBrokenPayload: RawCallbackRequest = {
  payload: {
    id: '900',
    type: '24',
  },
};

export const clearingBatchDomainEvent = {
  id: 'uuid_v4_example',
  props: {
    id: '900',
    reference: '900',
    type: '24',
  },
};
