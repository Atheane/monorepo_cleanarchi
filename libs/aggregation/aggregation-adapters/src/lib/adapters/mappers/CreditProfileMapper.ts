import { Bureau, Payment, CreditInsights, CreditProfile, CreditScoring } from '@oney/aggregation-core';
import { Mapper } from '@oney/common-core';
import { injectable } from 'inversify';
import { Aden } from '../partners/algoan/models/aden-analysis/Aden';
import { AlgoanPayment } from '../partners/algoan/models/aden-analysis/Bureau';

@injectable()
export class CreditProfileMapper implements Mapper<CreditProfile> {
  toDomain(raw: Aden): CreditProfile {
    const creditScoring: CreditScoring = {
      rate: raw.score.score,
      indicators: raw.score.indicators,
    };
    const { bureau: rawBureau } = raw;
    const bureau: Bureau = {
      credit: rawBureau.credit,
      events: rawBureau.events,
      gambling: rawBureau.gambling,
      frequentTransactions: rawBureau.frequentTransactions,
      incidents: rawBureau.incidents,
      overdraft: rawBureau.overdraft,
      payments: rawBureau.payments.map(payment => this.getPaymentToDomain(payment)),
    };

    const creditInsights: CreditInsights = {
      budget: raw.budget,
      dataQuality: raw.dataQuality,
      bureau,
    };

    const scoring: CreditProfile = {
      creditScoring,
      creditInsights,
    };

    return scoring;
  }

  private getPaymentToDomain(raw: AlgoanPayment): Payment {
    return {
      type: raw.algoanType,
      nbOfTransactions: raw.nbOfTransactions,
      references: raw.references,
      totalAmount: raw.totalAmount,
    };
  }
}
