import { DateTime } from 'luxon';
import { Mapper } from '@oney/common-core';
import { OperationDirection, OperationProperties } from '@oney/payment-core';
import { SmoneyGetSDDDetailsResponse } from '../partners/smoney/models/sdd/SmoneyGetSDDDetailsResponse';

const SOURCE_TIMEZONE = 'Europe/Paris';

type SDDSourceData = {
  tid: string;
  raw: SmoneyGetSDDDetailsResponse;
};

export class SmoneySDDMapper implements Mapper<OperationProperties, SDDSourceData> {
  toDomain({ raw, tid }: SDDSourceData): OperationProperties {
    return {
      orderId: raw.OrderId,
      uid: raw.AccountId.AppAccountId,
      cardId: null,
      tid,
      version: [
        {
          localAmount: raw.Amount,
          amount: raw.Amount,
          autoBalance: null,
          availableBalance: null,
          fee: null,
          cardType: null,
          clearingDate: raw.ExecutedDate
            ? /* istanbul ignore next: not required to test this branch */
              DateTime.fromISO(raw.ExecutedDate, { zone: SOURCE_TIMEZONE }).toUTC().toString()
            : null,
          conversionRate: null,
          conversionRateCleared: null,
          currency: '978',
          date: DateTime.fromISO(raw.OperationDate, { zone: SOURCE_TIMEZONE }).toUTC().toString(),
          direction:
            parseInt(raw.Direction.toString(), 10) === 1
              ? /* istanbul ignore next: not required to test this branch */
                OperationDirection.IN
              : OperationDirection.OUT,
          mcc: null,
          merchantAddress: null,
          merchantName: null,
          reason: raw.Message,
          rejection_reason: raw.Motif,
          status: raw.Status,
          type: raw.Type,
          note: null,
          category: null,
          nxData: null,
          linkedTransactions: [],
        },
      ],
    };
  }
}
