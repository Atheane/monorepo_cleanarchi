import { FacematchResult } from '@oney/profile-core';

export const facematchRequest = {
  uid: 'ttfacematch',
  customerRank: 0,
  selfieConsent: false,
  selfieConsentDate: new Date(),
  result: FacematchResult.OK,
  msg: 'message',
};
