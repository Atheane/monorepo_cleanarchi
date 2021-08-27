/* eslint-disable */

export const domainEvent = {
  "body": "{\"fiscalDeclaration\":{\"economicActivity\":\"11\",\"income\":\"1\"},\"fiscalReference\":{\"country\":\"FR\",\"fiscalNumber\":\"123456\"},\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"ow_KFDTZq\",\"namespace\":\"@oney/profile\",\"eventName\":\"FISCAL_STATUS_VALIDATED\",\"version\":1}}}",
  "label": "FISCAL_STATUS_VALIDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "FISCAL_STATUS_VALIDATED",
    "namespace": "@oney/profile",
    "version": 1,
  },
};

export const legacyEvent = {
  "body": {
    "uid": "ow_KFDTZq",
    "step": "fiscalStatus",
    "data": {
      "uid": "ow_KFDTZq",
      "email": "ozzj@yopmail.com",
      "biometric_key": null,
      "contract_signed_at": undefined,
      "is_validated": true,
      "profile": {
        "address": {
          "additional_street": "appartement 00",
          "city": "AUCH",
          "country": "FR",
          "street": " POUSTERLE DE PARIS",
          "zip_code": "32000",
        },
        "birth_date": new Date("1990-01-01T00:00:00.000Z"),
        "birth_city": undefined,
        "birth_country": "FR",
        "birth_department_code": undefined,
        "birth_district_code": undefined,
        "birth_name": undefined,
        "earnings_amount": 1,
        "economic_activity": 11,
        "first_name": undefined,
        "fiscal_country": undefined,
        "fiscal_reference": {
          "country": "FR",
          "fiscalNumber": "123456",
        },
        "honorific_code": undefined,
        "legal_name": undefined,
        "nationality_country_code": 'FR',
        "phone": "+33643455455",
        "status": "onBoarding",
      },
      "status": "onBoarding",
      "steps": ["address", "facematch", "contract"]
    }
  }
};
