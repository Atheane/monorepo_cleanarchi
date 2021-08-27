import { CustomerTitle } from './CustomerTitle';
import { AddressNature } from './AddressNature';
import { BankRole } from './BankRole';
import { AddressType } from './AddressType';

export interface Customer {
  title: CustomerTitle;
  birthdate: string;
  firstName: string;
  lastName: string;
  address: Address;
  email: string;
  mobileNumber: string;
  bankingInfo: BankInformation;
  number?: string;
}

export interface Address {
  addressType: AddressType;
  addressNature: AddressNature;
  iso2country: string;
  correspondence: boolean;
  city: string;
  zipCode: string;
  streetNumber?: string;
  address: string;
  additionalAddress?: string;
}

export interface BankInformation {
  bankAccountHolder: string;
  iban: string;
  bic: string;
  bankCard: CreditCard;
  role: BankRole;
}

export interface CreditCard {
  pan: string;
}
