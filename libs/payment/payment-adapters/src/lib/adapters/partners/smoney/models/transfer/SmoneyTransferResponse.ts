/* eslint-disable @typescript-eslint/no-explicit-any */
// todo fix error by using right types
export interface AccountId {
  Id: number;
  AppAccountId: string;
  DisplayName: string;
  Email?: any;
  PhoneNumber?: any;
  Alias?: any;
  Href: string;
  Iban: string;
}

export interface Bankaccount {
  Id: number;
  displayname: string;
  firstname: string;
  lastname: string;
  bic: string;
  iban: string;
  ismine: boolean;
  Status: number;
}

export interface Fee {
  Amount: number;
  VAT: number;
  AmountWithVAT: number;
  Status: number;
}

export interface Recurrent {
  Id: number;
  FrequencyType: number;
  RecurrentDays: number;
  Status: number;
  CreationDate: Date;
  ExecutionDate: string;
  RecurrentEndDate: string;
  LastExecutionDate?: any;
  NextExecutionDate: string;
  VirementsDone: number;
  ExecutedDate?: any;
}

export interface SmoneyTransferResponse {
  Id: number;
  AccountId: AccountId;
  bankaccount: Bankaccount;
  Amount: number;
  Fee: Fee;
  OperationDate: Date;
  ExecutionDate: string;
  Direction: number;
  Message: string;
  OrderId: string;
  Reference: string;
  Motif: string;
  ExecutedDate?: any;
  Type: number;
  RefundReference?: any;
  Planned: boolean;
  Recurrent: Recurrent;
}
