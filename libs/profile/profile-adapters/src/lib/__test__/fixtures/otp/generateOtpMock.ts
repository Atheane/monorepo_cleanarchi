import { Otp } from '@oney/profile-core';

export const otpMock = new Otp({
  codeHash: '8352d520f473c770bcf3719e6c01979f416720cd',
  createdAt: '2020-12-10T00:00:00.000Z',
  updatedAt: '2020-12-10T00:00:00.000Z',
  creationAttempts: 1,
  phone: '+33660708090',
  uid: 'AWzclPFyN',
});

export const phoneOtpCreatedMock = {
  body:
    '{"uid":"AWzclPFyN","phone":"+33660708090","code":"580461","domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Otp","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"PHONE_OTP_CREATED","version":1}}}',
  label: 'PHONE_OTP_CREATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'PHONE_OTP_CREATED',
    namespace: '@oney/profile',
    version: 1,
  },
};

export const phoneOtpUpdatedMock = {
  body:
    '{"uid":"AWzclPFyN","phone":"+33660708090","code":"580461","domainEventProps":{"timestamp":1607558400000,"sentAt":"2020-12-10T00:00:00.000Z","id":"uuid_v4_example","metadata":{"aggregate":"Otp","aggregateId":"AWzclPFyN","namespace":"@oney/profile","eventName":"PHONE_OTP_UPDATED","version":1}}}',
  label: 'PHONE_OTP_UPDATED',
  messageId: 'uuid_v4_example',
  partitionKey: 'uuid_v4_example',
  userProperties: {
    name: 'PHONE_OTP_UPDATED',
    namespace: '@oney/profile',
    version: 1,
  },
};
