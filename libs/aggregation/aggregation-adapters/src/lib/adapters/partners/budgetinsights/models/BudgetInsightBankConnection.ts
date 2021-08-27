import { BudgetInsightConnectionState } from './BudgetInsightConnectionState';

export type BudgetInsightBankConnection = {
  id: number;
  id_user: number | null;
  id_connector: number;
  state: BudgetInsightConnectionState;
  last_update: Date | null;
  created: Date | null;
  active: boolean;
  last_push: Date | null;
  next_try: Date | null;
  connector_uuid: string;
};
