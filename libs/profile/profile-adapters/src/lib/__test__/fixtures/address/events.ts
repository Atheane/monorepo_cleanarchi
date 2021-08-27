/* eslint-disable */
export const domainEvent = {
  "body": "{\"country\":\"MI\",\"street\":\"Rue saint domingue\",\"additionalStreet\":\"appartement 00\",\"zipCode\":\"00000\",\"city\":\"Muerta Island\",\"domainEventProps\":{\"timestamp\":1613606400000,\"sentAt\":\"2021-02-18T00:00:00.000Z\",\"id\":\"uuid_v4_example\",\"metadata\":{\"aggregate\":\"Profile\",\"aggregateId\":\"AWzclPFyN\",\"namespace\":\"@oney/profile\",\"eventName\":\"ADDRESS_STEP_VALIDATED\",\"version\":1}}}",
  "label": "ADDRESS_STEP_VALIDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "ADDRESS_STEP_VALIDATED",
    "namespace": "@oney/profile",
    "version": 1,
  },
};

export const legacyEvent = {
  "body": {
    "uid": "AWzclPFyN",
    "step": "address",
    "data": {
      "uid": "AWzclPFyN",
      "email": "ozzj@yopmail.com",
      "biometric_key": null,
      "contract_signed_at": undefined,
      "is_validated": true,
      "profile": {
        "address": {
          "street": "Rue saint domingue",
          "additional_street": "appartement 00",
          "city": "Muerta Island",
          "zip_code": "00000",
          "country": "MI"
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
          "establishmentDate": new Date('2020-11-07T00:00:00.000Z'),
          "fiscalNumber": "azerty",
        },
        "honorific_code": undefined,
        "legal_name": undefined,
        "nationality_country_code": 'FR',
        "phone": "+33643455455",
        "status": "onBoarding",
      },
      "status": "onBoarding",
      "steps": ["facematch", "fiscalStatus", "contract"]
    }
  }
};
