export const SITUATION_ATTACHED_LEAD_TRUE = {
  body:
    '{"lead":true,"staff":false,"vip":false,"consents":{"partners":{"cnil":false,"len":null},"oney":{"cnil":false,"len":null}},"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"bsXXuYexC","namespace":"@oney/profile","eventName":"SITUATION_ATTACHED","version":1}}}',
  label: 'SITUATION_ATTACHED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'SITUATION_ATTACHED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const SITUATION_ATTACHED_LEAD_FALSE_NO_LEN_CNIL_ON = {
  body:
    '{"lead":false,"staff":true,"vip":false,"consents":{"oney":{"cnil":true,"len":null},"partners":{"cnil":true,"len":null}},"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"SITUATION_ATTACHED","version":1}}}',
  label: 'SITUATION_ATTACHED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'SITUATION_ATTACHED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const SITUATION_ATTACHED_LEAD_FALSE_LEN_ON_CNIL_OFF = {
  body:
    '{"lead":false,"staff":true,"vip":false,"consents":{"oney":{"cnil":false,"len":true},"partners":{"cnil":false,"len":true}},"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"SITUATION_ATTACHED","version":1}}}',
  label: 'SITUATION_ATTACHED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'SITUATION_ATTACHED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const SITUATION_ATTACHED_LEAD_FALSE_LEN_OFF_CNIL_OFF = {
  body:
    '{"lead":false,"staff":true,"vip":false,"consents":{"oney":{"cnil":false,"len":false},"partners":{"cnil":false,"len":false}},"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"SITUATION_ATTACHED","version":1}}}',
  label: 'SITUATION_ATTACHED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'SITUATION_ATTACHED',
    namespace: '@oney/profile',
    version: 1,
  },
};
