export type SmoneyGetSDDDetailsResponseAccount = {
  Id: number;
  AppAccountId: string;
  DisplayName: string;
  Iban: string;
  Alias: string;
  PhoneNumber: string;
  Email: string;
  Href: string;
};

export type SmoneyGetSDDDetailsResponseMandate = {
  id: number;
  href: string;
};

export type SmoneyGetSDDDetailsResponse = {
  OrderId: string;
  Id: number;
  AccountId: SmoneyGetSDDDetailsResponseAccount;
  Mandate?: SmoneyGetSDDDetailsResponseMandate;
  BankAccount?: SmoneyGetSDDDetailsResponseAccount;
  Amount: number;
  Fee?: string;
  OperationDate: Date;
  Direction: number;
  ExecutionDate?: Date;
  Message: string;
  UniqueIdentification: string;
  Reference?: string;
  Motif: string;
  ExecutedDate?: Date;
  FirstName: string;
  LastName: string;
  PhoneNumber: string;
  Email: string;
  Alias: string;
  Status: number;
  Type: number;
  RefundReference: string;
  MatchStatus: number;
  MatchDate?: Date;
  MatchFileReceptionDate?: Date;
};
