enum OriginOperation {
  IN = 0,
  OUT = 1,
}

enum BankAccountStatus {
  VALIDATED = 1,
  PENDING = 2,
  REFUSED = 3,
}

export interface SmoneyBankAccountDetailResponse {
  Id: number;
  Displayname: string;
  Bic: string;
  Iban: string;
  IsMine: boolean;
  Status: BankAccountStatus;
  OriginOperation: OriginOperation;
}
