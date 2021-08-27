import { Steps } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { UserProfile } from '../../../models/MongodbProfile';

export interface LegacyEvent {
  payload: LegacyEventPayload;
  topic: string;
}

export interface LegacyEventPayload {
  uid: string;
  step: LegacyStepName;
  data: LegacyEventPayloadData;
}

export enum LegacyStepName {
  PhoneStepValidated = 'phone',
  AddressStepValidated = 'address',
  CivilStatusValidated = 'civilStatus',
  FiscalStatusValidated = 'fiscalStatus',
  ContractSigned = 'contract',
  ProfileCreated = 'created',
}

export interface LegacyEventPayloadData {
  uid: string;
  email: string;
  biometric_key: string;
  is_validated: boolean;
  profile: UserProfile;
  steps: Steps[];
  status: ProfileStatus;
  contract_signed_at: Date;
}
