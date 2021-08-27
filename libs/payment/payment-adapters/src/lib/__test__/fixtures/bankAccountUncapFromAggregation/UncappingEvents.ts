import { UncappingReason } from '@oney/payment-core';

export const uncappingStateEvent = {
  id: 'uuid_v4_example',
  metadata: { aggregate: 'BankAccount', aggregateId: 'tstUsr106' },
  props: { uncappingState: 'uncapped', reason: UncappingReason.AGGREGATION },
};
