import { BudgetInsightAccount } from './BudgetInsightAccount';
import { BIConnector, Fields } from './Connector';

export interface BIConnection {
  connector_uuid: string;
  id_user: number;
  id_bank: number;
  created: string;
  fields?: Fields[];
  id_provider: number;
  error_message: null | string;
  last_push: null;
  last_update: null;
  state: null | string;
  expire: null | string;
  error: null | string;
  active: boolean;
  next_try: null | string;
  id_connector: number;
  id: number;
  connector?: BIConnector;
  accounts?: BudgetInsightAccount[];
}

export enum BIConnectionError {
  WRONG_PASS = 'wrongpass',
  BUG = 'bug',
  WEBSITE_UNAVAILABLE = 'websiteUnavailable',
  ACTION_NEEDED = 'actionNeeded',
  PASSWORD_EXPIRED = 'passwordExpired',
  BAD_REQUEST = 'badRequest',
}

export interface BIConnectionBoosted {
  connectionId: string;
  userId: string;
  connection: BIConnection;
}

export type BudgetInsightFlowResponse = {
  auth_token: string;
};

export type BudgetInsightBankListResponse = {
  connectors: BIConnector[];
  total: number;
};
