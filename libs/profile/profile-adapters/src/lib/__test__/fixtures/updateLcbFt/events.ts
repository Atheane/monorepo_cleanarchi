/* eslint-disable */
export const updatedActionRequiredActivateStatusDomainEvent = {
  "body": "{\"status\":\"checkEligibility\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"PROFILE_STATUS_CHANGED\",\"version\":1}}}",
  "label": "PROFILE_STATUS_CHANGED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "PROFILE_STATUS_CHANGED",
    "namespace": "@oney/profile",
    "version": 1,
  },
};

export const updatedOnHoldStatusDomainEvent = {
  "body": "{\"status\":\"actionRequiredTaxNotice\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"PROFILE_STATUS_CHANGED\",\"version\":1}}}",
  "label": "PROFILE_STATUS_CHANGED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "PROFILE_STATUS_CHANGED",
    "namespace": "@oney/profile",
    "version": 1,
  },
};

export const moneyLaunderingRiskHighDomainEvent = {
  "body": "{\"moneyLaunderingRisk\":\"High\",\"status\":\"onBoarding\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"MONEY_LAUNDERING_RISK_UPDATED\",\"version\":1}}}",
  "label": "MONEY_LAUNDERING_RISK_UPDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "MONEY_LAUNDERING_RISK_UPDATED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

export const moneyLaunderingRiskMediumDomainEvent = {
  "body": "{\"moneyLaunderingRisk\":\"Medium\",\"status\":\"onBoarding\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"MONEY_LAUNDERING_RISK_UPDATED\",\"version\":1}}}",
  "label": "MONEY_LAUNDERING_RISK_UPDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "MONEY_LAUNDERING_RISK_UPDATED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

export const moneyLaunderingRiskLowDomainEvent = {
  "body": "{\"moneyLaunderingRisk\":\"Low\",\"status\":\"onHold\",\"domainEventProps\":{\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"xWr-VutjI\",\"namespace\":\"@oney/profile\",\"eventName\":\"MONEY_LAUNDERING_RISK_UPDATED\",\"version\":1}}}",
  "label": "MONEY_LAUNDERING_RISK_UPDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "MONEY_LAUNDERING_RISK_UPDATED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

export const moneyLaunderingRiskLowPendingDomainEvent = {
  "body": "{\"moneyLaunderingRisk\":\"Low\",\"status\":\"onHold\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"pendingUser\",\"namespace\":\"@oney/profile\",\"eventName\":\"MONEY_LAUNDERING_RISK_UPDATED\",\"version\":1}}}",
  "label": "MONEY_LAUNDERING_RISK_UPDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "MONEY_LAUNDERING_RISK_UPDATED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

export const moneyLaunderingRiskLowActiveDomainEvent = {
  "body": "{\"moneyLaunderingRisk\":\"Low\",\"status\":\"active\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"active\",\"namespace\":\"@oney/profile\",\"eventName\":\"MONEY_LAUNDERING_RISK_UPDATED\",\"version\":1}}}",
  "label": "MONEY_LAUNDERING_RISK_UPDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "MONEY_LAUNDERING_RISK_UPDATED",
    "namespace": "@oney/profile",
    "version": 1
  }
};

