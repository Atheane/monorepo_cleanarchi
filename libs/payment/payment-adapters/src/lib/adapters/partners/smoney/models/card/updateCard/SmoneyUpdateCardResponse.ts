import { SmoneyCardLimits } from '../SmoneyCardLimits';

export interface SmoneyUpdateCardResponse {
  Name?: string;
  CardLimits: SmoneyCardLimits;
  Blocked: number;
  ForeignPaymentBlocked: number;
  InternetPaymentBlocked: number;
}
