import { HonorificCode } from '@oney/profile-core';
import { Profile } from '../aggregates/Profile';

export interface ContractDocumentRequest {
  uid: string;
  honorificCode: HonorificCode;
  birthName: string;
  legalName: string;
  firstName: string;
  birthDate: Date;
  birthCountry: string;
  birthCity: string;
  nationalityCountryCode: string;
  street: string;
  zipCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  economicActivity: string;
  earningsAmount: string;
  fiscalCountry: string;
  signatureDate?: Date;
  nif?: string;
}

export interface ContractDocumentGateway {
  create(profile: Profile): Promise<Buffer>;

  createAndSave(profile: Profile): Promise<string>;

  get(uid: string): Promise<Buffer>;
}
