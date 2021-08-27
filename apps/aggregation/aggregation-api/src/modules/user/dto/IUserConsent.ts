import { UserProperties } from '@oney/aggregation-core';

export type IUserConsent = Pick<UserProperties, 'userId' | 'consent' | 'consentDate'>;
