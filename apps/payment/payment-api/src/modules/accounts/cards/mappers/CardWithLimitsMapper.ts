import { CardProperties } from '@oney/payment-core';
import { injectable } from 'inversify';
import { CardWithLimitsDto } from '../dto/CardWithLimitsDto';

@injectable()
export class CardWithLimitsMapper {
  fromDomain(raw: CardProperties, maxAtmWeeklyAllowance: number, maxMonthlyAllowance: number) {
    const cardWithLimitsDto: CardWithLimitsDto = {
      ...raw,
      maxAtmWeeklyAllowance,
      maxMonthlyAllowance,
    };

    return cardWithLimitsDto;
  }
}
