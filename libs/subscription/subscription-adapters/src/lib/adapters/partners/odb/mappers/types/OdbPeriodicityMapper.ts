import { Mapper } from '@oney/common-core';
import { Periodicity } from '@oney/subscription-messages';
import { injectable } from 'inversify';
import { SubscriptionErrors } from '@oney/subscription-core';

@injectable()
export class OdbPeriodicityMapper implements Mapper<Periodicity> {
  toDomain(periodicity: string): Periodicity {
    switch (periodicity) {
      case 'monthly':
        return Periodicity.MONTHLY;
      case 'annual':
        return Periodicity.ANNUAL;
      default:
        throw new SubscriptionErrors.PeriodicityInvalid('PERIODICITY_INVALID', {
          cause: `received value : ${periodicity}`,
        });
    }
  }
}
