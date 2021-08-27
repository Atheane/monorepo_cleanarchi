import { EarningsThreshold } from './EarningsThreshold';

export interface DeclarativeFiscalSituation {
  economicActivity: string;
  income: EarningsThreshold | string;
}
