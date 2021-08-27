import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import { DataRecoveryResponse } from '../models/dataRecovery/DataRecoveryResponse';
import { OneyTrustCheckSumGenerator } from '../OneyTrustCheckSumGenerator';

export class DataRecoveryApi {
  constructor(
    private readonly _oneyTrustCheckSumGenerator: OneyTrustCheckSumGenerator,
    private readonly _entityReference: number,
    private readonly _login: string,
    private readonly _oneyTrustFolderApiBaseUrl: string,
  ) {}

  async get({ caseReference }): Promise<DataRecoveryResponse> {
    const checksumPayload = { entityReference: this._entityReference, caseReference };
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generateTulipeChecksum(checksumPayload);

    const { data } = await httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(this._oneyTrustFolderApiBaseUrl)
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        'content-type': 'application/json',
      })
      .post<DataRecoveryResponse>(`/tulipe/v2/${this._entityReference}/cases/${caseReference}/dataRecovery`, {
        login: this._login,
      })
      .execute();

    return data;
  }
}
