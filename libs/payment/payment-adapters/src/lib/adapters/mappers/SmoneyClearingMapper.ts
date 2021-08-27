import * as cc from 'currency-codes';
import { DateTime } from 'luxon';
import { Mapper } from '@oney/common-core';
import { OperationDirection, OperationProperties, GetSingleClearingPayload } from '@oney/payment-core';
import { SmoneyGetCOPDetailsResponse } from '../partners/smoney/models/cop/SmoneyGetCOPDetailsResponse';

const SOURCE_TIMEZONE = 'Europe/Paris';

type COPSourceData = {
  raw: SmoneyGetCOPDetailsResponse;
  getSingleClearingPayload: GetSingleClearingPayload;
};

export class SmoneyClearingMapper implements Mapper<OperationProperties, COPSourceData> {
  toDomain(data: COPSourceData): OperationProperties {
    const { raw, getSingleClearingPayload } = data;

    let merchantAddress = '';
    if (getSingleClearingPayload.merchant) {
      if (getSingleClearingPayload.merchant.street) {
        merchantAddress += getSingleClearingPayload.merchant.street;
      }
      if (getSingleClearingPayload.merchant.city) {
        merchantAddress += ` ${getSingleClearingPayload.merchant.city}`;
      }
    }
    merchantAddress = merchantAddress.trim();

    const localAmount = getSingleClearingPayload.originalAmount ? getSingleClearingPayload.originalAmount : 0;

    const amount = getSingleClearingPayload.amount ? getSingleClearingPayload.amount : localAmount;

    const currencyFromTrigram = cc.code(getSingleClearingPayload.currency);
    const currencyFromCodeNumber = cc.number(getSingleClearingPayload.currency);
    const currency = currencyFromCodeNumber ? currencyFromCodeNumber.number : currencyFromTrigram.number;

    return {
      orderId: raw.OrderId,
      uid: raw.AccountId.AppAccountId,
      cardId: raw.Card.AppCardId,
      tid: getSingleClearingPayload.tid,
      version: [
        {
          localAmount,
          amount,
          autoBalance: null,
          availableBalance: null,
          beneficiary: null,
          issuer: null,
          fee: null,
          cardType: getSingleClearingPayload.financialNetworkCode,
          clearingDate: DateTime.fromISO(raw.ExecutedDate, {
            zone: SOURCE_TIMEZONE,
          })
            .toUTC()
            .toJSDate(),
          conversionRate: getSingleClearingPayload.exchangeRate,
          conversionRateCleared: getSingleClearingPayload.exchangeRate,
          currency,
          date: DateTime.fromISO(raw.OperationDate, { zone: SOURCE_TIMEZONE }).toUTC().toJSDate(),
          direction: raw.Direction === 1 ? OperationDirection.IN : OperationDirection.OUT,
          mcc: getSingleClearingPayload.merchant.categoryCode,
          merchantAddress: merchantAddress !== '' ? merchantAddress : null,
          merchantName: getSingleClearingPayload.merchant.name,
          reason: null,
          rejection_reason: null,
          refundReference: raw.RefundReference,
          initialOperation: null,
          status: getSingleClearingPayload.status,
          type: getSingleClearingPayload.type,
          note: null,
          category: null,
          nxData: null,
          linkedTransactions: [],
        },
      ],
    };
  }
}
