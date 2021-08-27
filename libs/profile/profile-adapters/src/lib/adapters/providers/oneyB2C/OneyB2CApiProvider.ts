import { BaseApiProvider } from '@oney/common-adapters';
import { IHttpBuilder } from '@oney/http';
import { OneyB2CAuthenticationApi, OneyB2CConfiguration } from './api/OneyB2CAuthenticationApi';
import { OneyB2CCustomerApi } from './api/OneyB2CCustomerApi';

export interface OneyCrmApi {
  OneyB2CCustomerApi: OneyB2CCustomerApi;
  oneyB2CAuthenticationApi: OneyB2CAuthenticationApi;
}

export class OneyB2CApiProvider extends BaseApiProvider<OneyCrmApi> {
  private readonly _oneyB2CAuthentication: OneyB2CAuthenticationApi;
  private readonly _client: IHttpBuilder;

  constructor(client: IHttpBuilder, oneyB2CConfig: OneyB2CConfiguration) {
    super(client, 'ONEY_CRM_API_ERROR');
    this._oneyB2CAuthentication = new OneyB2CAuthenticationApi(client, oneyB2CConfig);
    this._client = client;
  }

  api(): OneyCrmApi {
    return {
      OneyB2CCustomerApi: new OneyB2CCustomerApi(this._client, this._oneyB2CAuthentication),
      oneyB2CAuthenticationApi: this._oneyB2CAuthentication,
    };
  }
}
