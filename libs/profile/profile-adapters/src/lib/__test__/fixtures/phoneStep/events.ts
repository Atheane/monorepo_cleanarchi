/* eslint-disable */
export const domainEvent = {
  "body": '{"phone":"+33656776668","domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"unitTestPhoneStep01","namespace":"@oney/profile","eventName":"PHONE_STEP_VALIDATED","version":1}}}',
  "label": "PHONE_STEP_VALIDATED",
  "messageId": "uuid_v4_example",
  "partitionKey": "uuid_v4_example",
  "userProperties": {
    "name": "PHONE_STEP_VALIDATED",
    "namespace": "@oney/profile",
    "version": 1,
  },
};

export const legacyEvent = {
  "body": {
    "uid": "unitTestPhoneStep01",
    "step": "phone",
    "data": {
      "uid": "unitTestPhoneStep01",
      "email": "nacimiphone8@yopmail.com",
      "biometric_key": null,
      "contract_signed_at": new Date('2021-01-01'),
      "is_validated": true,
      "profile": {
        "address": {
          "street": " POUSTERLE DE PARIS",
          "additional_street": "appartement 00",
          "city": "AUCH",
          "zip_code": "32000",
          "country": "FR"
        },
        "birth_date": new Date("1990-01-01T00:00:00.000Z"),
        "birth_city": "Paris",
        "birth_country": "FR",
        'birth_department_code': '75',
        'birth_district_code': '01',
        "birth_name": "Mazen",
        "earnings_amount": 1,
        "economic_activity": 11,
        "first_name": "Mazendk",
        "fiscal_country": "FR",
        "fiscal_reference": {
          "country": "FR",
          "establishmentDate": new Date('2020-11-07T00:00:00.000Z'),
          "fiscalNumber": "azerty",
        },
        "honorific_code": "2",
        "legal_name": "Mazen",
        "nationality_country_code": "FR",
        "phone": "+33656776668",
        "status": "onBoarding",
      },
      "status": "onBoarding",
      "steps": ["subscription", "identityDocument", "facematch", "address", "civilStatus", "fiscalStatus", "contract"]
    }
  }
};
