import { AccountStatementProperties } from '../types/AccountStatementProperties';

export interface AccountStatementRepository {
  getListByUserId(uid: string): Promise<AccountStatementProperties[]>;
  exists(uid: string, dateTo: Date): Promise<boolean>;
  save(props: AccountStatementProperties): Promise<AccountStatementProperties>;
}
