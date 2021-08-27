/* eslint-disable */

export const domainEvent = {
  body:
    '{"birthCity":"Paris","birthCountry":"FR","birthDate":"1992-11-15T00:00:00.000Z","birthName":"ellezam","firstName":"chalom","honorificCode":"1","legalName":"azaeaze","nationalityCountryCode":"FR","domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"CIVIL_STATUS_VALIDATED","version":1}}}',
  label: 'CIVIL_STATUS_VALIDATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'CIVIL_STATUS_VALIDATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const domainEventCustomerSituation = {
  body:
    '{"lead":false,"staff":false,"vip":false,"consents":{"oney":{"cnil":true,"len":null},"partners":{"cnil":true,"len":null}},"domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"SITUATION_ATTACHED","version":1}}}',
  label: 'SITUATION_ATTACHED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'SITUATION_ATTACHED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const legacyEvent = {

  'body': {
    'data': {
      'biometric_key': null,
      'contract_signed_at': undefined,
      'email': 'ozzj@yopmail.com',
      'is_validated': true,
      'profile': {
        'address': {
          'additional_street': 'appartement 00',
          'city': 'AUCH',
          'country': 'FR',
          'street': ' POUSTERLE DE PARIS',
          'zip_code': '32000',
        },
        'birth_city': 'Paris',
        'birth_country': 'FR',
        'birth_date': new Date('1992-11-15T00:00:00.000Z'),
        'birth_department_code': '75',
        'birth_district_code': '01',
        'birth_name': 'ellezam',
        'earnings_amount': 1,
        'economic_activity': 11,
        'first_name': 'chalom',
        'fiscal_country': undefined,
        'fiscal_reference': {
          "country": "FR",
          "establishmentDate": new Date('2020-11-07T00:00:00.000Z'),
          "fiscalNumber": "azerty",
        },
        'honorific_code': '1',
        'legal_name': 'azaeaze',
        'nationality_country_code': 'FR',
        'phone': '+33643455455',
        'status': 'onBoarding',
      },
      'status': 'onBoarding',
      'steps': ['facematch', 'address', 'fiscalStatus', 'contract'],
      'uid': 'AWzclPFyN',
    }, 'step': 'civilStatus', 'uid': 'AWzclPFyN',
  },
};

export const domainEventError = {
  body:
    '{"name":"UnauthorizedBirthCountry","code":"E001_U002","domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregateId":"AWzclPFyN","aggregate":"Profile","namespace":"@oney/profile","eventName":"CIVIL_STATUS_VALIDATION_FAILED","version":1}}}',
  label: 'CIVIL_STATUS_VALIDATION_FAILED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'CIVIL_STATUS_VALIDATION_FAILED',
    namespace: '@oney/profile',
    version: 1,
  },
};
