import { ProfileStatus } from '@oney/profile-messages';
import { Address } from './Address';
import { FiscalReference } from './FiscalReference';
import { BirthDate } from './BirthDate';
import { BirthCountry } from './BirthCountry';
import { HonorificCode } from '../types/HonorificCode';

export class ProfileInformations {
  status: ProfileStatus;
  honorificCode: HonorificCode;
  birthName: string;
  legalName: string;
  firstName: string;
  birthDate: BirthDate;
  birthCity: string;
  birthDepartmentCode: string;
  birthDistrictCode: string;
  birthCountry: BirthCountry;
  nationalityCountryCode: string;
  phone: string;
  economicActivity: number;
  earningsAmount: number;
  fiscalCountry: string;
  address: Address;
  fiscalReference: FiscalReference;

  constructor(profileInformations: ProfileInformations) {
    Object.assign(this, profileInformations);
  }
}
