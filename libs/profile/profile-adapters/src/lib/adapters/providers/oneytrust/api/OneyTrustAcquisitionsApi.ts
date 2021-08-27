import { IHttpBuilder } from '@oney/http';
import { OneyTrustCheckSumGenerator } from '../OneyTrustCheckSumGenerator';
import { CreateOneyTrustFolderRequest } from '../models/acquisitionsApi/CreateOneyTrustFolderRequest';
import { CreateOneyTrustFolderResponse } from '../models/acquisitionsApi/CreateOneyTrustFolderResponse';

export class OneyTrustAcquisitionsApi {
  constructor(
    private readonly _http: IHttpBuilder,
    private readonly _oneyTrustCheckSumGenerator: OneyTrustCheckSumGenerator,
  ) {}

  async createFolder(request: CreateOneyTrustFolderRequest): Promise<CreateOneyTrustFolderResponse> {
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generate(request);

    const { data } = await this._http
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        'content-type': 'application/x-www-form-urlencoded',
      })
      .post('/acquisitions', `payload=${encodeURIComponent(JSON.stringify(request))}`)
      .execute();

    return data as CreateOneyTrustFolderResponse;
  }
}
