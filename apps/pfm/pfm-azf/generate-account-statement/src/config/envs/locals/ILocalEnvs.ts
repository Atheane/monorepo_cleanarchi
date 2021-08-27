export interface ILocalEnvs {
  odbDBPfmName: string;
  odbDBAccountName: string;
  odbDBTransactionName: string;
  odbDBEventStoreName: string;
  sMoneyApiUrl: string;
  odbGeneratedStatementTopic: string;
  odbFrontDoorUrl: string;
  serviceBusSubscription: string;
  paymentTopic: string;
  pfmTopic: string;
  generateStatementTopic: string;
  dbConnectionPoolSize: number;
  dbConnectionMaxPoolSize: number;
}
