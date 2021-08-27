export interface ServiceBusConfiguration {
  subscriptionName: string;
  emailTopic: string;
  smsTopic: string;
  pushTopic: string;
  pdfTopic: string;
  preferencesTopic: string;
  transactionFunctionsTopic: string;
  odbPaymentTopic: string;
  connectionString: string;
  odbCreditTopic: string;
  odbAggregationTopic: string;
  odbProfileTopic: string;
}
