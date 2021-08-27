import { inject, injectable } from 'inversify';
import { AxiosHttpMethod, httpBuilder, IHttpBuilder } from '@oney/http';
import { Identifier } from '../../../../config/di/Identifier';
import { IAzfConfiguration } from '../../../../config/envs/IAzfConfiguration';
import { BIConnector } from '../models/BIConnector';
import { BudgetInsightAccount } from '../models/BudgetInsightAccount';

@injectable()
export class BudgetInsightConnectionService {
  private readonly connection: IHttpBuilder;

  constructor(@inject(Identifier.config) private readonly config: IAzfConfiguration) {
    const httpService = new AxiosHttpMethod();
    this.connection = httpBuilder<AxiosHttpMethod>(httpService).setBaseUrl(
      this.config.budgetInsightConfiguration.baseUrl,
    );
  }

  setCredentials(credential: string): void {
    this.connection.setDefaultHeaders({ Authorization: `Bearer ${credential}` });
  }

  async getBankById(id: string): Promise<BIConnector> {
    const { data } = await this.connection.get<BIConnector>(`/connectors/${id}?capabilities=bank`).execute();
    return data;
  }

  async getBankConnectionByAccountId(id: string): Promise<BudgetInsightAccount> {
    const { data } = await this.connection
      .get<BudgetInsightAccount>(`/users/me/accounts/${id}?expand=connection`)
      .execute();
    return data;
  }
}
