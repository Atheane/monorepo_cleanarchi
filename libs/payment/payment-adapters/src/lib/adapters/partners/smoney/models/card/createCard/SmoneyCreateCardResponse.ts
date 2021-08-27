import { SmoneyCardLimits } from '../SmoneyCardLimits';

export interface AccountId {
  Id: number;
  AppAccountId: string;
  DisplayName: string;
  Iban: string;
  Alias?: string;
  PhoneNumber: string;
  Email: string;
  Href?: string;
}

export interface SmoneyCreationType {
  RelatedCard?: string;
  Action: number;
}

export interface SmoneyCreateCardResponse {
  Id: number;
  AppCardId: string;
  IsAlphaTest: number;
  IsContactlessBlocked: number;
  Network: number;
  Hint: string;
  Name?: string;
  Country: string;
  Type: number;
  ExpiryDate: string;
  Status: number;
  OpposedReason?: string;
  AccountId: AccountId;
  CreationType: SmoneyCreationType;
  FintechCultureName: string;
  CardLimits: SmoneyCardLimits;
  Blocked: number;
  ForeignPaymentBlocked: number;
  InternetPaymentBlocked: number;
  UseRandomPin: number;
  UniqueId: string;
  BankId: string;
  CancellationReason: number;
}
