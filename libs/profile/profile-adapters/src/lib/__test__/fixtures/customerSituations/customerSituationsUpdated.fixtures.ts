export const customerSituationsUpdatedDomainEvent = {
  body:
    '{"uuid":"beGe_flCm","timestamp":"2020-12-10T00:00:00.000Z","lead":true,"internalIncidents":{"storeCreditLimitBlocked":false,"oneyVplusCreditLimitBlocked":false,"debtRestructured":false,"overIndebted":false},"domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"beGe_flCm","namespace":"@oney/profile","eventName":"CUSTOMER_SITUATIONS_UPDATED","version":1}}}',
  label: 'CUSTOMER_SITUATIONS_UPDATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'CUSTOMER_SITUATIONS_UPDATED',
    namespace: '@oney/profile',
    version: 1,
  },
};
