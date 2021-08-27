/* eslint-disable */

export const domainEventProfileStatusChanged = {
  'body': '{"status":"checkRequiredAml","domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"PROFILE_STATUS_CHANGED","version":1}}}',
  'label': 'PROFILE_STATUS_CHANGED',
  'messageId': 'uuid_v4_example',
  'partitionKey': 'uuid_v4_example',
  'userProperties': {
    'name': 'PROFILE_STATUS_CHANGED',
    'namespace': '@oney/profile',
    'version': 1,
  },
};

export const domainEventContractSigned = {
  'body': '{"date":"2021-02-18T00:00:00.000Z","domainEventProps":{"timestamp":1613606400000,"sentAt":"2021-02-18T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Profile","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"CONTRACT_SIGNED","version":1}}}',
  'label': 'CONTRACT_SIGNED',
  'messageId': 'uuid_v4_example',
  'partitionKey': 'uuid_v4_example',
  'userProperties': {
    'name': 'CONTRACT_SIGNED',
    'namespace': '@oney/profile',
    'version': 1,
  },
};

export const legacyEvent = {
  'body': {
    'uid': 'AWzclPFyN',
    'step': 'contract',
    'data': {
      'uid': 'AWzclPFyN',
      'email': 'nacimiphone8@yopmail.com',
      'biometric_key': null,
      'contract_signed_at': new Date('2021-02-18T00:00:00.000Z'),
      'is_validated': true,
      'profile': {
        'birth_date': new Date('1990-01-01T00:00:00.000Z'),
        'address': {
          'additional_street': 'appartement 00',
          'city': 'AUCH',
          'country': 'FR',
          'street': ' POUSTERLE DE PARIS',
          'zip_code': '32000',
        },
        'birth_city': 'Paris',
        'birth_country': 'FR',
        'birth_department_code': '75',
        'birth_district_code': '01',
        'birth_name': 'Mazen',
        'earnings_amount': 1,
        'economic_activity': 11,
        'first_name': 'Mazendk',
        'fiscal_country': 'FR',
        'fiscal_reference': {
          "country": "FR",
          "establishmentDate": new Date("2020-11-07T00:00:00.000Z"),
          "fiscalNumber": "azerty",
        },
        'honorific_code': '2',
        'legal_name': 'Mazen',
        'nationality_country_code': 'FR',
        'phone': '+33633335552',
        'status': 'checkRequiredAml',
      },
      'status': 'checkRequiredAml',
      'steps': [
        'phone',
        'subscription',
        'identityDocument',
        'facematch',
        'address',
        'civilStatus',
        'fiscalStatus',
      ],
    },
  },
};
