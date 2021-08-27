import { Env, Local } from '@oney/env';
import { ILocalEnvs } from './ILocalEnvs';

@Local()
export class LocalEnvs implements ILocalEnvs {
  @Env('ODB_DB_PFM_NAME')
  odbDBPfmName: string;

  @Env('ODB_DB_ACCOUNT_NAME')
  odbDBAccountName: string;

  @Env('ODB_DB_EVENT_STORE_NAME')
  odbDBEventStoreName: string;

  @Env('ODB_DB_TRANSACTION_NAME')
  odbDBTransactionName: string;

  @Env('ODB_STATEMENTS_GENERATED_STATEMENT_TOPIC')
  odbGeneratedStatementTopic: string;

  @Env('SERVICE_BUS_PFM_STATEMENT_TOPIC')
  generateStatementTopic: string;

  @Env('SMONEY_API_URL')
  sMoneyApiUrl: string;

  @Env('ODB_FRONT_DOOR_URL')
  odbFrontDoorUrl: string;

  @Env('DB_CONNECTION_POOL_SIZE')
  dbConnectionPoolSize: number;

  @Env('DB_CONNECTION_MAX_POOL_SIZE')
  dbConnectionMaxPoolSize: number;
}
