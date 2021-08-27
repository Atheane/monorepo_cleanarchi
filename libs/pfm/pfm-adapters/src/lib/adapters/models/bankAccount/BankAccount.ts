import { Currency } from '@oney/common-core';
import { AggregationBank } from '../bank/Bank';

export type AggregationAccount = {
  id: string;
  name: string;
  number?: string;
  currency: Currency;
  balance: number;
  establishment: {
    name: string;
  };
  metadatas: {
    iban: string;
    fullname: string;
  };
  bank?: AggregationBank;
};

type SMoneyAddress = {
  Street: string;
  ZipCode: string;
  City: string;
  Country: string;
};

type SMoneyProfile = {
  Civility: number;
  FirstName: string;
  LastName: string;
  Birthdate: Date;
  Birthcity: string;
  BirthCountry: string;
  Address: SMoneyAddress;
  PhoneNumber: string;
  Email: string;
  Alias: string;
  Picture: {
    Href?: string;
  };
  EconomicActivity: number;
};

type SMoneySubAccount = {
  Id: number;
  AppAccountId: string;
  Amount: number;
  AccountingBalanceAmount: number;
  DisplayName: string;
  CreationDate: Date;
  IsDefault: boolean;
  Iban: string;
};

export type SMoneyBankAccount = {
  Id: number;
  AppUserId: string;
  Type: number;
  Role: number;
  Profile: SMoneyProfile;
  Credentials?: string;
  Amount: number;
  AccountingBalanceAmount: number;
  SubAccounts: SMoneySubAccount[];
  BankAccounts: null;
  CBCards: null;
  Status: 1;
  Company: null;
  CountryCode: null;
};
