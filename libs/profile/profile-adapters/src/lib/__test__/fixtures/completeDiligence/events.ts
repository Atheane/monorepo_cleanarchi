/* eslint-disable */
export const activateDomainEvent = {
  "body": "{\"profileStatus\":\"active\",\"activationType\":\"transfer\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"PROFILE_ACTIVATED\",\"version\":1}}}",
  "label": "PROFILE_ACTIVATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "PROFILE_ACTIVATED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

export const completeDomainEvent = {
  "body": "{\"status\":\"active\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"DILIGENCE_SCT_IN_COMPLETED\",\"version\":1}}}",
  "label": "DILIGENCE_SCT_IN_COMPLETED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "DILIGENCE_SCT_IN_COMPLETED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

export const updatedStatusCompleteDomainEvent = {
  "body": "{\"status\":\"active\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"PROFILE_STATUS_CHANGED\",\"version\":1}}}",
  "label": "PROFILE_STATUS_CHANGED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "PROFILE_STATUS_CHANGED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

export const updatedStatusRefusedDomainEvent = {
  "body": "{\"status\":\"actionRequiredActivate\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"PROFILE_STATUS_CHANGED\",\"version\":1}}}",
  "label": "PROFILE_STATUS_CHANGED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "PROFILE_STATUS_CHANGED",
    "namespace": "@oney/profile",
    "version": 1
  }
};
