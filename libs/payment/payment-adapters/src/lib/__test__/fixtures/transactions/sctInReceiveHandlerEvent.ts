import { SctInReceivedProperties } from '@oney/payment-messages';

export const SctInReceiveEventPropsMocked: SctInReceivedProperties = {
  callback: {
    userid: 'test',
  },
  details: {
    AccountId: {
      AppAccountId: 'test',
    },
    Amount: 1220,
    OrderId: 'orderX123',
  },
};

export const SctInReceiveEventMocked = {
  id: 'poazkeozae',
  props: SctInReceiveEventPropsMocked,
};

export const spectedDebtCollectionUsecaseParametersReceived = {
  amount: 12.2,
  uid: 'test',
};
