import { AxiosHttpMethod, httpBuilder, IHttpBuilder } from '@oney/http';
import { injectable } from 'inversify';
import { stringify } from 'qs';
import { AlgoanConfig } from './AlgoanConfig';
import { AuthenticationResponse } from '../adapters/infra/network/types/AlgoanResponse';

@injectable()
export class AlgoanHttpClient {
  readonly client: IHttpBuilder;

  constructor(private readonly _algoanConfig: AlgoanConfig) {
    const httpService = new AxiosHttpMethod();
    this.client = httpBuilder(httpService);
    this.client.setBaseUrl(_algoanConfig.baseUrl);
    this.client.setDefaultHeaders({
      'Content-Type': 'application/json; charset=utf-8',
    });
  }

  async authenticate() {
    this.client.setDefaultHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    const credentials = {
      client_id: this._algoanConfig.clientId,
      client_secret: this._algoanConfig.clientSecret,
      grant_type: 'client_credentials',
    };
    const result = await this.client
      .post<AuthenticationResponse>(`/oauth/token`, stringify(credentials))
      .execute();
    this.client.setDefaultHeaders({
      Authorization: `Bearer ${result.data.access_token}`,
      'Content-Type': 'application/json; charset=utf-8',
    });
  }
}
