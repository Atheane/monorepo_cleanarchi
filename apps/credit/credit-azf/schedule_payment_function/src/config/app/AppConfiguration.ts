import {
  IAppConfiguration,
  IServiceBusConfiguration,
} from '../../../../adapters/src/di/app/IAppConfiguration';
import { ILocalEnvs } from '../env/locals/ILocalEnvs';
import { ISecretEnvs } from '../env/secrets/ISecretEnvs';

export class AppConfiguration implements IAppConfiguration {
  readonly mongoURI: string;
  readonly odbPaymentAuthKey: string;
  readonly odbPaymentBaseUrl: string;
  readonly odbPaymentRetryDelay: number;
  readonly odbPaymentMaxRetries: number;
  readonly serviceBusConfiguration: IServiceBusConfiguration;

  constructor(private localEnvs: ILocalEnvs, private secretEnvs: ISecretEnvs) {
    this.mongoURI = this.secretEnvs.mongoURI;
    this.odbPaymentAuthKey = this.secretEnvs.odbPaymentAuthKey;
    this.odbPaymentBaseUrl = this.localEnvs.odbPaymentBaseUrl;
    this.odbPaymentRetryDelay = this.localEnvs.odbPaymentRetryDelay;
    this.odbPaymentMaxRetries = this.localEnvs.odbPaymentMaxRetries;
    this.serviceBusConfiguration = {
      connectionString: this.secretEnvs.serviceBusConnectionString,
      subscription: this.localEnvs.serviceBusSubscription,
      topic: this.localEnvs.serviceBusTopic,
    };
  }
}
