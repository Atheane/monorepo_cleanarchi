export interface SmoneyUpdateCardRequest {
  smoneyId: string;

  cardId: string;

  Blocked: number;

  ForeignPaymentBlocked: number;

  InternetPaymentBlocked: number;

  CardLimits: {
    ATMWeeklyAllowance: number;

    MonthlyAllowance: number;
  };
}
