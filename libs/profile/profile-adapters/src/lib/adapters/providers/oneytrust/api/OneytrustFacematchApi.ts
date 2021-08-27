import { IHttpBuilder } from '@oney/http';
import { OneyTrustCheckSumGenerator } from '../OneyTrustCheckSumGenerator';
import { OneytrustFacematchRequest } from '../models/facematch/OneytrustFacematchRequest';

export class OneytrustFacematchApi {
  constructor(
    private readonly _http: IHttpBuilder,
    private readonly _oneyTrustCheckSumGenerator: OneyTrustCheckSumGenerator,
    private readonly _entityReference: number,
  ) {}

  async sendFacematch(request: OneytrustFacematchRequest): Promise<void> {
    const payload = {
      ...request,
      entityReference: this._entityReference,
    };
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generate(payload);
    this._http.setDefaultHeaders({
      'X-Checksum': generateCheckSum,
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    await this._http
      .post(`/selfieoutcome`, `payload=${encodeURIComponent(JSON.stringify(payload))}`)
      .execute();
  }
}
