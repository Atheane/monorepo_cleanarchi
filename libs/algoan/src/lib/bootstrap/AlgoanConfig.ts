import { LongPollingConfig } from '../adapters/infra/network/types/LongPolling';

export class AlgoanConfig {
  baseUrl: string;
  clientSecret: string;
  clientId: string;
  longPolling: LongPollingConfig;
}
