import { BankConnectionDeleted } from '@oney/aggregation-messages';

export const bankConnectionDeletedMessage: BankConnectionDeleted = {
  id: 'aozekoazek',
  props: {
    userId: 'azieh',
    deletedAccountIds: ['13388'],
    refId: '1805',
  },
  metadata: {
    aggregate: BankConnectionDeleted.name,
    aggregateId: 'testUid',
  },
};
