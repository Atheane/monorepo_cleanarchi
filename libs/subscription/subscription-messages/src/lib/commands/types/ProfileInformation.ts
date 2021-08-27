import { HonorificCode } from '@oney/profile-messages';

export interface ProfileInformation {
  honorificCode: HonorificCode;
  firstName: string;
  legalName: string;
  birthDate: Date;
  email: string;
  phone: string;
  address: {
    street: string;
    additionalStreet?: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
