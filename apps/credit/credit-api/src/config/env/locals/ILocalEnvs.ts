export interface ILocalEnvs {
  serviceBusSub: string;
  serviceBusTopic: string;
  odbCreditTermsVersion: string;
  port: number;
  odbPaymentBaseUrl: string;
  odbPaymentMaxRetries: number;
  odbPaymentRetryDelay: number;
  containerName: string;
  x3FeesRate: number;
  x4FeesRate: number;
  x3SplitFeesMaximumThreshold: number;
  x4SplitFeesMaximumThreshold: number;
  useAppInsights: boolean;
  appInsightsTrackBodies: boolean;
  appInsightsTrackConsoleLogs: boolean;
  odbCreditDbName: string;
  azureTenantId: string;
  oneyComptaClientId: string;
  frontDoorApiBaseUrl: string;
  paymentTopic: string;
  cdpTopic: string;
}
