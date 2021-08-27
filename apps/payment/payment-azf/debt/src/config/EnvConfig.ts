import { Env, Local } from '@oney/env';

@Local()
export class EnvConfig {
  @Env('DEBT_FUNCTION_DB_PROVIDER')
  mongoPath: string;

  @Env('DEBT_FUNCTION_DB_COLLECTION')
  mongoDbCollection: string;

  @Env('DEBT_FUNCTION_SERVICE_BUS_CONNECTION_STRING')
  serviceBusUrl: string;

  @Env('DEBT_FUNCTION_SERVICE_BUS_SUBSCRIPTION')
  serviceBusSub: string;

  @Env('ODB_PAYMENT_TOPIC')
  serviceBusTopic: string;
}

export const envConfiguration = new EnvConfig();
