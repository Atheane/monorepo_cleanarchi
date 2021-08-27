import { Clearing, FinancialNetworkCode } from '@oney/payment-core';
import { Mapper } from '@oney/common-core';
import { SmoneyGetClearingBatchResponseClearing } from '../partners/smoney/models/clearingBatch/SmoneyGetClearingBatchResponse';

export class SmoneyClearingBatchMapper implements Mapper<Clearing, SmoneyGetClearingBatchResponseClearing> {
  toDomain(data: SmoneyGetClearingBatchResponseClearing): Clearing {
    return {
      reference: data.card_operation_reference,
      originalAmount:
        data.card_operation.original_amount || data.card_operation.original_amount === 0
          ? data.card_operation.original_amount
          : 0,
      amount: data.card_operation.amount || data.card_operation.amount === 0 ? data.card_operation.amount : 0,
      financialNetworkCode: FinancialNetworkCode[data.card_operation.financial_network_code],
      exchangeRate: data.card_operation.exchange_rate,
      currency: data.card_operation.currency,
      status: data.card_operation.operation_status,
      type: data.card_operation.operation_type,
      cardId: data.card_operation.card_identifier,
      merchant: {
        street: data.card_operation.merchant.street,
        city: data.card_operation.merchant.city,
        categoryCode: data.card_operation.merchant_category_code,
        name: data.card_operation.merchant.name,
      },
    };
  }
}
