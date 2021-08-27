import Big from 'big.js';
import { DateTime } from 'luxon';
import { Mapper } from '@oney/common-core';
import { OperationDirection, GetCOPPayload, OperationProperties } from '@oney/payment-core';
import { SmoneyGetCOPDetailsResponse } from '../partners/smoney/models/cop/SmoneyGetCOPDetailsResponse';

const SOURCE_TIMEZONE = 'Europe/Paris';

type COPSourceData = {
  raw: SmoneyGetCOPDetailsResponse;
  getCOPPayload: GetCOPPayload;
};

export class SmoneyCOPMapper implements Mapper<OperationProperties, COPSourceData> {
  toDomain(data: COPSourceData): OperationProperties {
    const { raw, getCOPPayload } = data;

    const nbSlash = (getCOPPayload.cardAcceptorIdentificationCodeName.match(/\\/g) || []).length;
    const [merchantName, merchantAddress] = getCOPPayload.cardAcceptorIdentificationCodeName.split(
      '\\'.repeat(nbSlash),
    );

    const localAmount = getCOPPayload.transactionAmount
      ? parseInt(new Big(getCOPPayload.transactionAmount).times(100).toString(), 10)
      : 0;

    const amount = getCOPPayload.cardHolderBillingAmount
      ? parseInt(new Big(getCOPPayload.cardHolderBillingAmount).times(100).toString(), 10)
      : localAmount;

    return {
      orderId: raw.OrderId,
      uid: raw.AccountId.AppAccountId,
      cardId: raw.Card.AppCardId,
      tid: getCOPPayload.tid,
      version: [
        {
          localAmount,
          amount,
          autoBalance: null,
          availableBalance: getCOPPayload.availableBalance
            ? parseInt(new Big(getCOPPayload.availableBalance).times(100).toString(), 10)
            : null,
          fee: null,
          cardType: -1, // Imformation not available
          clearingDate: DateTime.fromISO(raw.ExecutedDate, {
            zone: SOURCE_TIMEZONE,
          })
            .toUTC()
            .toJSDate(),
          conversionRate: getCOPPayload.cardHolderBillingConversionRate
            ? parseFloat(getCOPPayload.cardHolderBillingConversionRate)
            : null,
          conversionRateCleared: null,
          currency: getCOPPayload.currencyCodeTransaction,
          date: DateTime.fromISO(raw.ExecutedDate, { zone: SOURCE_TIMEZONE }).toUTC().toJSDate(),
          direction: raw.Direction === 1 ? OperationDirection.IN : OperationDirection.OUT,
          mcc: parseInt(getCOPPayload.merchantType, 10),
          merchantAddress,
          merchantName,
          reason: null,
          rejection_reason: raw.Motif,
          status: parseInt(getCOPPayload.status, 10),
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
