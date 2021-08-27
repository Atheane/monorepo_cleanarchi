export interface SmoneyGetCOPDetailsResponseAccountId {
  Id: number;
  AppAccountId: string;
  DisplayName: string;
  Iban: string;
  Alias: string;
  PhoneNumber: string;
  Email: string;
  Href: string;
}

export interface SmoneyGetCOPDetailsResponseCard {
  Id: number;
  AppCardId: string;
  Href: string;
}

export interface SmoneyGetCOPDetailsResponse {
  Id: number;
  AccountId: SmoneyGetCOPDetailsResponseAccountId;
  Card: SmoneyGetCOPDetailsResponseCard;
  Amount: number;
  Fee?: string;
  OperationDate: Date;
  ExecutionDate?: Date;
  ExecutedDate: Date;
  Direction: number;
  OrderId: string;
  Motif?: string;
  Status: number;
  Type: number;
  RefundReference?: string;
  InitialOperation?: string;
}
