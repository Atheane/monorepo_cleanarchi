import { IHttpBuilder } from '@oney/http';
import { SmoneyGetSDDDetailsResponse } from '../models/sdd/SmoneyGetSDDDetailsResponse';
import { SmoneyGetSDDDetailsRequest } from '../models/sdd/SmoneyGetSDDDetailsRequest';
import { SmoneyGetCOPDetailsResponse } from '../models/cop/SmoneyGetCOPDetailsResponse';
import { SmoneyGetCOPDetailsRequest } from '../models/cop/SmoneyGetCOPDetailsRequest';
import { SmoneyGetClearingBatchResponse } from '../models/clearingBatch/SmoneyGetClearingBatchResponse';
import { SmoneyGetClearingBatchRequest } from '../models/clearingBatch/SmoneyGetClearingBatchRequest';

export class SmoneyOperationApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async getSDDDetails(request: SmoneyGetSDDDetailsRequest): Promise<SmoneyGetSDDDetailsResponse> {
    const { data } = await this._http.get<SmoneyGetSDDDetailsResponse>(`sdd/${request.reference}`).execute();
    return data;
  }

  async getCOPDetails(request: SmoneyGetCOPDetailsRequest): Promise<SmoneyGetCOPDetailsResponse> {
    const { data } = await this._http
      .get<SmoneyGetCOPDetailsResponse>(`cardoperations/${request.reference}`)
      .execute();
    return data;
  }

  async getClearingBatchDetails(
    request: SmoneyGetClearingBatchRequest,
  ): Promise<SmoneyGetClearingBatchResponse> {
    const { data } = await this._http
      .get<SmoneyGetClearingBatchResponse>(`cardoperations/clearingreport/${request.reference}`)
      .execute();
    return data;
  }
}
