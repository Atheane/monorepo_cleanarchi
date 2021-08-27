import { Mapper } from '@oney/common-core';
import { Card } from '@oney/payment-core';
import { SmoneyUpdateCardRequest } from '../partners/smoney/models/card/updateCard/SmoneyUpdateCardRequest';

export class SmoneyCardUpdateMapper implements Mapper<Card, SmoneyUpdateCardRequest> {
  fromDomain(card: Card): SmoneyUpdateCardRequest {
    const {
      id,
      ownerId,
      preferences: { blocked, foreignPayment, internetPayment, atmWeeklyAllowance, monthlyAllowance },
    } = card.props;

    return {
      smoneyId: ownerId,
      cardId: id,
      Blocked: +blocked,
      ForeignPaymentBlocked: +!foreignPayment,
      InternetPaymentBlocked: +!internetPayment,
      CardLimits: {
        ATMWeeklyAllowance: atmWeeklyAllowance,
        MonthlyAllowance: monthlyAllowance,
      },
    };
  }
}
