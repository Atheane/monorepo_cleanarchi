export const stateChangingToUncapping = {
  body:
    '{"uncappingState":"uncapping","reason":"tax_statement","domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"BankAccount","aggregateId":"tstUsr106","namespace":"@oney/payment","eventName":"UNCAPPING_STATE_CHANGED","version":1}}}',
  label: 'UNCAPPING_STATE_CHANGED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'UNCAPPING_STATE_CHANGED',
    namespace: '@oney/payment',
    version: 1,
  },
};

export const stateChangingToCapped = {
  body:
    '{"uncappingState":"capped","reason":"tax_statement","domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"BankAccount","aggregateId":"tstUsr106","namespace":"@oney/payment","eventName":"UNCAPPING_STATE_CHANGED","version":1}}}',
  label: 'UNCAPPING_STATE_CHANGED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'UNCAPPING_STATE_CHANGED',
    namespace: '@oney/payment',
    version: 1,
  },
};

export const stateChangingToCappedObject = {
  id: 'uuid_v4_example',
  metadata: {
    aggregate: 'BankAccount',
    aggregateId: 'tstUsr106',
  },
  props: {
    reason: 'aggregation',
    uncappingState: 'capped',
  },
};
