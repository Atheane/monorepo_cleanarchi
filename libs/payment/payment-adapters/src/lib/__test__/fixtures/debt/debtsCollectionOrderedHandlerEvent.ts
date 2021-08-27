import { DebtsCollectionOrderedProps } from '@oney/payment-messages';

export const DebtsCollectionOrderedEventPropsMocked: DebtsCollectionOrderedProps = {
  amount: 1200,
  uid: 'orderX123',
};

export const DebtsCollectionOrderedEventMocked = {
  id: 'orderX123',
  props: DebtsCollectionOrderedEventPropsMocked,
};
