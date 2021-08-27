export interface SmoneyPaymentRequest {
  orderid: string;
  beneficiary: {
    appaccountid: string;
  };
  sender: {
    appaccountid: string;
  };
  amount: number;
  message: string;
  checkLimits: boolean;
  tag: string;
  processUnpaid: boolean;
  Recurrent: {
    RecurrentEndDate: string;
    FrequencyType: number;
    RecurrentDays: number;
  };
}
