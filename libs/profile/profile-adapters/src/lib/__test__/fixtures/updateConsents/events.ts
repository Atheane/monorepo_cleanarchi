export const consentWithAllFieldsEvent = {
  body:
    '{"oney":{"cnil":true,"len":true},"partners":{"cnil":true,"len":true},"domainEventProps":{"timestamp":1617235200000,"sentAt":"2021-04-01T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"CONSENT_UPDATED","version":1}}}',
  label: 'CONSENT_UPDATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'CONSENT_UPDATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const consentWithoutAllFieldsEvent = {
  body:
    '{"oney":{"cnil":true},"partners":{"cnil":true},"domainEventProps":{"timestamp":1617235200000,"sentAt":"2021-04-01T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"CONSENT_UPDATED","version":1}}}',
  label: 'CONSENT_UPDATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'CONSENT_UPDATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const consentWithAllFieldsFalseEvent = {
  body:
    '{"oney":{"cnil":false,"len":false},"partners":{"cnil":false,"len":false},"domainEventProps":{"timestamp":1617235200000,"sentAt":"2021-04-01T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"CONSENT_UPDATED","version":1}}}',
  label: 'CONSENT_UPDATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'CONSENT_UPDATED',
    namespace: '@oney/profile',
    version: 1,
  },
};
