import { BaseApiProvider } from '@oney/common-adapters';
import { IHttpBuilder } from '@oney/http';
import { injectable } from 'inversify';
import { OneyTrustCheckSumGenerator } from './OneyTrustCheckSumGenerator';
import { OneyTrustCaseApi } from './api/OneyTrustCaseApi';
import { OneyTrustAcquisitionsApi } from './api/OneyTrustAcquisitionsApi';
import { OneytrustFacematchApi } from './api/OneytrustFacematchApi';
import { OneyTrustKycApi } from './api/OneyTrustKycApi';
import { DataRecoveryApi } from './api/DataRecoveryApi';

export interface OneytrustApis {
  OneytrustFacematchApi: OneytrustFacematchApi;
  oneyTrustCaseApi: OneyTrustCaseApi;
  oneyTrustAcquisitionsApi: OneyTrustAcquisitionsApi;
  oneyTrustKycApi: OneyTrustKycApi;
  dataRecovery: DataRecoveryApi;
}

export interface OneyTrustApiConfiguration {
  entityReference: number;
  login: string;
  secretKey: string;
  oneyTrustFolderBaseApi: string;
}

@injectable()
export class OneytrustApiProvider extends BaseApiProvider<OneytrustApis> {
  private readonly _oneyTrustCheckSumGenerator: OneyTrustCheckSumGenerator;
  private readonly _oneyTrustApiConfig: OneyTrustApiConfiguration;
  private readonly _client: IHttpBuilder;

  constructor(client: IHttpBuilder, apiErrorName: string, oneyTrustApiConfig: OneyTrustApiConfiguration) {
    super(client, apiErrorName);
    this._client = client;
    this._oneyTrustApiConfig = oneyTrustApiConfig;
    this._oneyTrustCheckSumGenerator = new OneyTrustCheckSumGenerator(oneyTrustApiConfig.secretKey);
  }

  api(): OneytrustApis {
    return {
      OneytrustFacematchApi: new OneytrustFacematchApi(
        this._client,
        this._oneyTrustCheckSumGenerator,
        this._oneyTrustApiConfig.entityReference,
      ),
      oneyTrustCaseApi: new OneyTrustCaseApi(
        this._oneyTrustCheckSumGenerator,
        this._oneyTrustApiConfig.entityReference,
        this._oneyTrustApiConfig.login,
        this._oneyTrustApiConfig.oneyTrustFolderBaseApi,
      ),
      oneyTrustAcquisitionsApi: new OneyTrustAcquisitionsApi(this._client, this._oneyTrustCheckSumGenerator),
      oneyTrustKycApi: new OneyTrustKycApi(
        this._oneyTrustCheckSumGenerator,
        this._oneyTrustApiConfig.entityReference,
        this._oneyTrustApiConfig.login,
        this._oneyTrustApiConfig.oneyTrustFolderBaseApi,
      ),
      dataRecovery: new DataRecoveryApi(
        this._oneyTrustCheckSumGenerator,
        this._oneyTrustApiConfig.entityReference,
        this._oneyTrustApiConfig.login,
        this._oneyTrustApiConfig.oneyTrustFolderBaseApi,
      ),
    };
  }
}
