import { CardType } from '@oney/payment-messages';
import { VisaAssistance } from '../types/VisaAssistance';

export interface CardOffer {
  type: CardType;
  img: string;
  blocked: boolean;
  foreignPayment: boolean;
  internetPayment: boolean;
  atmWeeklyAllowance: number;
  atmMonthlyAllowance: number;
  price: number;
  assistance: VisaAssistance[];
}
