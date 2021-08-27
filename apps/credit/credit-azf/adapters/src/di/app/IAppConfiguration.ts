export interface IServiceBusConfiguration {
  connectionString: string;
  subscription: string;
  topic: string;
}
export interface IAppConfiguration {
  mongoURI: string;
  odbPaymentAuthKey: string;
  odbPaymentBaseUrl: string;
  odbPaymentRetryDelay: number;
  odbPaymentMaxRetries: number;
  serviceBusConfiguration: IServiceBusConfiguration;
}
