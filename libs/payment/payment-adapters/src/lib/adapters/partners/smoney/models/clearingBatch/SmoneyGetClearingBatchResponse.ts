export interface SmoneyGetClearingBatchResponse {
  callback_type: number;
  batch_reference: number;
  clearings: SmoneyGetClearingBatchResponseClearing[];
}

export interface SmoneyGetClearingBatchResponseClearing {
  card_operation_reference: string;
  card_operation: SmoneyGetClearingBatchResponseCardOperation;
}

export interface SmoneyGetClearingBatchResponseCardOperation {
  authorization_reference: string;
  card_identifier: string;
  amount: number;
  date: string;
  merchant_name: string;
  merchant_category_code: number;
  financial_network_code: string;
  original_amount: number;
  currency: string;
  exchange_rate: number;
  merchant: SmoneyGetClearingBatchResponseMerchant;
  type_code: string;
  pos_entry_mode: string;
  operation_type: number;
  operation_status: number;
  service_fee: number;
  direction: number;
  clearing_date: string;
}

export interface SmoneyGetClearingBatchResponseMerchant {
  name: string;
  street: string;
  city: string;
}
