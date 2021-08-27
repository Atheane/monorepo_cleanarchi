/* eslint-disable */

export const odbDocumentAddedEvent = {
  body:
    '{"uid":"unique-id","type":"tax_notice","partner":"ODB","location":"MnDqtMQrm/kyc/tax_notice_1613606400000.jpg","domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"DOCUMENT_ADDED","version":1}}}',
  label: 'DOCUMENT_ADDED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'DOCUMENT_ADDED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const profileStatusChangedEvent = {
  body:
    '{"status":"onBoarding","domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"PROFILE_STATUS_CHANGED","version":1}}}',
  label: 'PROFILE_STATUS_CHANGED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'PROFILE_STATUS_CHANGED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const taxNoticeUploadedEvent = {
  body:
    '{"document":{"uid":"unique-id","type":"tax_notice","partner":"ODB","location":"MnDqtMQrm/kyc/tax_notice_1613606400000.jpg"},"domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"TAX_NOTICE_UPLOADED","version":1}}}',
  label: 'TAX_NOTICE_UPLOADED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'TAX_NOTICE_UPLOADED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const taxNoticeUploadedSecondEvent = {
  body:
    '{"document":{"uid":"unique-id","type":"tax_notice","partner":"ODB","location":"MnDqtMQrm/kyc/tax_notice_1614988800000.jpg"},"domainEventProps":{"timestamp":1614988800000,"sentAt":"2021-03-06T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"TAX_NOTICE_UPLOADED","version":1}}}',
  label: 'TAX_NOTICE_UPLOADED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'TAX_NOTICE_UPLOADED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const kycDocumentAddedEvent = {
  body:
    '{"uid":"59227","type":"tax_notice","partner":"KYC","location":"https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/SP_2021219_MnDqtMQrm_MAfuN2jT8/files","domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"DOCUMENT_ADDED","version":1}}}',
  label: 'DOCUMENT_ADDED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'DOCUMENT_ADDED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const newKycFolderCreatedEvent = {
  body:
    '{"caseReference":"SP_202136_MnDqtMQrm_unique-id","caseId":52787,"domainEventProps":{"timestamp":1614988800000,"sentAt":"2021-03-06T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"NEW_KYC_CREATED","version":1}}}',
  label: 'NEW_KYC_CREATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'NEW_KYC_CREATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const newFolderOdbDocumentAddedEvent = {
  body:
    '{"uid":"unique-id","type":"tax_notice","partner":"ODB","location":"MnDqtMQrm/kyc/tax_notice_1614988800000.jpg","domainEventProps":{"timestamp":1614988800000,"sentAt":"2021-03-06T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"DOCUMENT_ADDED","version":1}}}',
  label: 'DOCUMENT_ADDED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'DOCUMENT_ADDED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const newFolderProfileStatusChangedEvent = {
  body:
    '{"status":"onBoarding","domainEventProps":{"timestamp":1614988800000,"sentAt":"2021-03-06T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"PROFILE_STATUS_CHANGED","version":1}}}',
  label: 'PROFILE_STATUS_CHANGED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'PROFILE_STATUS_CHANGED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const newFolderKycDocumentAddedEvent = {
  body:
    '{"uid":"59227","type":"tax_notice","partner":"KYC","location":"https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/SP_202136_MnDqtMQrm_unique-id/files","domainEventProps":{"timestamp":1614988800000,"sentAt":"2021-03-06T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"DOCUMENT_ADDED","version":1}}}',
  label: 'DOCUMENT_ADDED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'DOCUMENT_ADDED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const kycDocumentDeletedEvent = {
  body:
    '{"uid":"59227","type":"tax_notice","partner":"KYC","location":"https://api-staging.oneytrust.com/web-services/api/v2/3000001341/cases/SP_2021219_MnDqtMQrm_MAfuN2jT8/files","domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"MnDqtMQrm","namespace":"@oney/profile","eventName":"DOCUMENT_DELETED","version":1}}}',
  label: 'DOCUMENT_DELETED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'DOCUMENT_DELETED',
    namespace: '@oney/profile',
    version: 1,
  },
};
