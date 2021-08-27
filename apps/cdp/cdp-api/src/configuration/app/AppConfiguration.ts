import { ILocalEnvs } from '../env/locals/ILocalEnvs';
import { ISecretEnvs } from '../env/secrets/ISecretEnvs';

export class AppConfiguration {
  public readonly localEnvs: ILocalEnvs;
  public readonly secretEnvs: ISecretEnvs;

  constructor(localEnvs: ILocalEnvs, secretEnvs: ISecretEnvs) {
    this.localEnvs = localEnvs;
    this.secretEnvs = secretEnvs;
  }

  get nodeEnv(): string {
    return this.localEnvs.nodeEnv;
  }

  get port(): number {
    return this.localEnvs.port;
  }

  get useAppInsights(): boolean {
    return this.localEnvs.useAppInsights;
  }

  get appInsightsKey(): string {
    return this.secretEnvs.appInsightsKey;
  }

  get aggregationTopic(): string {
    return this.localEnvs.aggregationTopic;
  }

  get creditTopic(): string {
    return this.localEnvs.creditTopic;
  }

  get notificationTopic(): string {
    return this.localEnvs.notificationTopic;
  }

  get transactionTopic(): string {
    return this.localEnvs.transactionTopic;
  }

  get paymentTopic(): string {
    return this.localEnvs.paymentTopic;
  }

  get cardLifecycleFunctionTopic(): string {
    return this.localEnvs.cardLifecycleFunctionTopic;
  }

  get paymentAzfEkycTopic(): string {
    return this.localEnvs.paymentAzfEkycTopic;
  }

  get profileTopic(): string {
    return this.localEnvs.profileTopic;
  }

  get profileAzfTopic(): string {
    return this.localEnvs.profileAzfTopic;
  }

  get serviceBusConnectionString(): string {
    return this.secretEnvs.serviceBusConnectionString;
  }

  get cdpTopic(): string {
    return this.localEnvs.cdpTopic;
  }

  get cdpSubscription(): string {
    return this.localEnvs.cdpSubscription;
  }
}
