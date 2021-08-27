export type SmoneyBankAccountBeneficiary = {
  Demands?: string;
  Id: number;
  DisplayName: string;
  Bic: string;
  Iban: string;
  FirstName?: string;
  LastName?: string;
  CompanyName?: string;
  ZipCode?: string;
  Email?: string;
  PhoneNumber?: string;
  CreationDate: Date;
  ModificationDate?: string;
  IsMine: boolean;
  Status: number;
  OriginOperation: number;
};
