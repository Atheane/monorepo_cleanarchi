import { defaultLogger } from '@oney/logger-adapters';
import { injectable } from 'inversify';
import { AxiosHttpMethod, httpBuilder, IHttpBuilder } from '@oney/http';
import { BankAccountProperties, IAppConfiguration } from '@oney/aggregation-core';
import {
  AccountTypes,
  BudgetInsightTransactionsResponse,
  BIDeleteUser,
  BudgetInsightAccountsResponse,
  BudgetInsightAccount,
  BudgetInsightUserIdentityResponse,
  BIConnection,
  BudgetInsightFlowResponse,
  BudgetInsightBankListResponse,
  BIConnector,
} from './models';
import { LongPolling } from '../../services/LongPolling';

@injectable()
export class BIConnectionService {
  private readonly connection: IHttpBuilder;

  constructor(private readonly config: IAppConfiguration) {
    const httpService = new AxiosHttpMethod();
    this.connection = httpBuilder<AxiosHttpMethod>(httpService).setBaseUrl(
      this.config.budgetInsightConfiguration.baseUrl,
    );
  }

  setCredentials(credential: string): void {
    this.connection.setDefaultHeaders({ Authorization: `Bearer ${credential}` });
  }

  async getNewCredentials(): Promise<string> {
    const result = await this.connection
      .post<BudgetInsightFlowResponse>('/auth/init', {
        client_id: this.config.budgetInsightConfiguration.clientId,
        client_secret: this.config.budgetInsightConfiguration.clientSecret,
      })
      .execute();
    return result.data.auth_token;
  }

  async getConnectorById(connectorId: string): Promise<BIConnector> {
    const result = await this.connection
      .get<BIConnector>(`/connectors/${connectorId}?capabilities=bank&expand=fields,logos`)
      .execute();
    return result.data;
  }

  async getAllConnectors(): Promise<BudgetInsightBankListResponse> {
    const result = await this.connection
      .get<BudgetInsightBankListResponse>('/connectors?capabilities=bank&expand=fields,logos')
      .execute();
    return result.data;
  }

  async postConnection(body: object): Promise<BIConnection> {
    const result = await this.connection.post<BIConnection>('/users/me/connections', body).execute();
    return result.data;
  }

  async postSca(connectionRefId: string, body: object): Promise<BIConnection> {
    const result = await this.connection
      .post<BIConnection>(`/users/me/connections/${connectionRefId}`, body)
      .execute();
    return result.data;
  }

  async getAccountsByConnectionId(refId: string): Promise<BudgetInsightAccountsResponse> {
    const result = await this.connection
      .get<BudgetInsightAccountsResponse>(`/users/me/connections/${refId}/accounts?all`)
      .execute();
    return result.data;
  }

  async aggregateAccountsByConnectionId(refId: string, accountIds: string): Promise<BudgetInsightAccount[]> {
    const result = await this.connection
      .put<any>(`/users/me/connections/${refId}/accounts/${accountIds}?all`, {
        // BI return is not consistent
        disabled: false,
      })
      .execute();
    /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
    return result.data?.accounts ?? [result.data];
  }

  async disaggregateAccountsByConnectionId(
    refId: string,
    accountIds: string,
  ): Promise<BudgetInsightAccount[]> {
    const result = await this.connection
      .put<any>(`/users/me/connections/${refId}/accounts/${accountIds}?all`, {
        // BI return is not consistent
        disabled: true,
      })
      .execute();
    /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
    return result.data?.accounts ?? [result.data];
  }

  async updateAccountsByConnectionId(
    refId: string,
    accounts: Pick<BankAccountProperties, 'id' | 'name' | 'aggregated'>[],
  ): Promise<BudgetInsightAccount[]> {
    const accountsToBeAggregated = accounts.filter(account => account.aggregated);
    let resultAggregated: BudgetInsightAccount[] = [];
    if (accountsToBeAggregated.length > 0) {
      const accountIds = accountsToBeAggregated.map(account => account.id).join(',');
      resultAggregated = await this.aggregateAccountsByConnectionId(refId, accountIds);
    }

    const accountsToBeDisAggregated = accounts.filter(account => !account.aggregated);
    let resultDisAggregated: BudgetInsightAccount[] = [];
    if (accountsToBeDisAggregated.length > 0) {
      const accountIds = accountsToBeDisAggregated.map(account => account.id).join(',');
      resultDisAggregated = await this.disaggregateAccountsByConnectionId(refId, accountIds);
    }
    return [...resultAggregated, ...resultDisAggregated];
  }

  async renameAccount(
    connectionId: string,
    account: Pick<BankAccountProperties, 'id' | 'name'>,
  ): Promise<BudgetInsightAccount> {
    const result = await this.connection
      .post<BudgetInsightAccount>(`/users/me/connections/${connectionId}/accounts/${account.id}?all`, {
        name: account.name,
      })
      .execute();
    return result.data;
  }

  async disaggregateAccounts(
    accountIds: Pick<BankAccountProperties, 'id'>[],
  ): Promise<BudgetInsightAccount[]> {
    const accountString = accountIds.map(account => account.id).join(',');
    const result = await this.connection
      .put<any>(`/users/me/accounts/${accountString}?all`, {
        // BI return is not consistent
        disabled: true,
      })
      .execute();
    /* istanbul ignore next: waiting for istanbul to support typescript optional chaining operator */
    return result.data?.accounts ?? [result.data];
  }

  async getAccountTypes(): Promise<AccountTypes> {
    const result = await this.connection.get<AccountTypes>('/account_types').execute();
    return result.data;
  }

  async getTransactionsByAccountId(accountId: string): Promise<BudgetInsightTransactionsResponse> {
    const getTransactionsByAccountIdRequest = await this.connection.get<BudgetInsightTransactionsResponse>(
      `/users/me/accounts/${accountId}/transactions`,
    ).execute;

    const longPollingSuccessCondition = result => {
      defaultLogger.info(
        'BIConnectionService -> getTransactionsByAccountId -> longPollingSuccessCondition -> transactions.length',
        result.data.transactions.length,
      );
      return result.data.transactions.length > 0;
    };

    const longPolling = new LongPolling(this.config.budgetInsightConfiguration.longPolling);

    const transactions = await longPolling.polling<BudgetInsightTransactionsResponse>(
      getTransactionsByAccountIdRequest,
      longPollingSuccessCondition,
    );

    return transactions;
  }

  async getOwnerIdentity(connectionRefId: string): Promise<BudgetInsightUserIdentityResponse> {
    const getOwnerIdentityRequest = this.connection.get<BudgetInsightUserIdentityResponse>(
      `/users/me/connections/${connectionRefId}/informations`,
    ).execute;

    const longPollingSuccessCondition = result => {
      defaultLogger.info(
        'BIConnectionService -> getTransactionsByAccountId -> longPollingSuccessCondition -> owner',
        result.data.owner,
      );
      return result.data.owner !== undefined;
    };

    const longPolling = new LongPolling(this.config.budgetInsightConfiguration.longPolling);

    const ownerIdentity = await longPolling.polling<BudgetInsightUserIdentityResponse>(
      getOwnerIdentityRequest,
      longPollingSuccessCondition,
    );
    return ownerIdentity;
  }

  async deleteBankConnection(refId: string): Promise<void> {
    await this.connection.delete(`/users/me/connections/${refId}`).execute();
  }

  async deleteUser(): Promise<void> {
    await this.connection.delete<BIDeleteUser>(`/users/me`).execute();
  }
}
