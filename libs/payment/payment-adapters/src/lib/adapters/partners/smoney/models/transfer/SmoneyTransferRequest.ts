export interface SmoneyTransferRequest {
  OrderId: string;
  Amount: number;
  Planned: boolean;
  ExecutionDate: string;
  Accountid: {
    AppAccountId: string;
  };
  BankAccount: {
    id: string;
  };
  Message: string;
  Reference: string;
  Motif: string;
  Recurrent: {
    RecurrentEndDate: string;
    FrequencyType: number;
    RecurrentDays: number;
  };
}
