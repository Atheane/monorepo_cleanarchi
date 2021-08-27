import { BankAccount, BankAccountProperties } from '../aggregates/BankAccount';

export interface BankAccountGateway {
  updateAccounts(
    refId: string,
    accounts: Pick<BankAccountProperties, 'id' | 'name' | 'aggregated'>[],
  ): Promise<BankAccount[]>;
  disaggregateAccounts(accounts: BankAccount[]): Promise<BankAccount[]>;
  getAccountsFromRefId(refId: string, aggregated?: boolean): Promise<BankAccount[]>;
}
