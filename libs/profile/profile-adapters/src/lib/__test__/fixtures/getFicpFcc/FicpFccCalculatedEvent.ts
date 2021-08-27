export const FicpFlagTrue = {
  body:
    '{"uid":"AWzclPFyN","statusCode":200,"creditIncident":true,"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"namespace":"@oney/profile","eventName":"FICP_FCC_CALCULATED","version":1}}}',
  label: 'FICP_FCC_CALCULATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'FICP_FCC_CALCULATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const FicpFlagNoLead = {
  body:
    '{"uid":"AWzclPFyN","statusCode":200,"creditIncident":false,"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"namespace":"@oney/profile","eventName":"FICP_FCC_CALCULATED","version":1}}}',
  label: 'FICP_FCC_CALCULATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'FICP_FCC_CALCULATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const CallFccFailed = {
  body:
    '{"uid":"AWzclPFyN","statusCode":500,"creditIncident":false,"paymentIncident":true,"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"namespace":"@oney/profile","eventName":"FICP_FCC_CALCULATED","version":1}}}',
  label: 'FICP_FCC_CALCULATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'FICP_FCC_CALCULATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const FccFlagFalse = {
  body:
    '{"uid":"AWzclPFyN","statusCode":200,"creditIncident":false,"paymentIncident":false,"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"namespace":"@oney/profile","eventName":"FICP_FCC_CALCULATED","version":1}}}',
  label: 'FICP_FCC_CALCULATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'FICP_FCC_CALCULATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const FccFlagTrue = {
  body:
    '{"uid":"AWzclPFyN","statusCode":200,"creditIncident":false,"paymentIncident":true,"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"namespace":"@oney/profile","eventName":"FICP_FCC_CALCULATED","version":1}}}',
  label: 'FICP_FCC_CALCULATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'FICP_FCC_CALCULATED',
    namespace: '@oney/profile',
    version: 1,
  },
};
