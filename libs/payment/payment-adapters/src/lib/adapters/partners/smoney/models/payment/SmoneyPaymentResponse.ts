interface Sender {
  Id: number;
  AppAccountId: string;
  DisplayName: string;
  Email: string;
  PhoneNumber: string;
  Alias: string;
  Iban: string;
  Href: string;
}

interface Beneficiary {
  Id: number;
  AppAccountId: string;
  DisplayName: string;
  Email: string;
  PhoneNumber: string;
  Alias: string;
  Iban: string;
  Href: string;
}

export interface SmoneyPaymentResponse {
  Id: number;
  PaymentDate: Date;
  Amount: number;
  Sender: Sender;
  Beneficiary: Beneficiary;
  Message: string;
  OrderId: string;
  Status: number;
  CheckLimits: boolean;
  Tag: string;
}
