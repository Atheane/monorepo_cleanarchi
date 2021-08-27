import { IHttpBuilder } from '@oney/http';
import {
  GetRequestIdCommand,
  GetRequestIdResponse,
  OneyGetRequestIdResponse,
  GetFlagResponse,
  OneyGetFlagResponse,
} from '../models/fccModels';

export class OneyFccApi {
  constructor(private readonly _http: IHttpBuilder, private readonly _cypherDecipherHttp: IHttpBuilder) {}

  async getRequestId(request: GetRequestIdCommand): Promise<GetRequestIdResponse> {
    try {
      const { data, status } = await this._cypherDecipherHttp
        .setAdditionnalHeaders({
          'X-Oney-Secret': 'Method-body',
        })
        .post<OneyGetRequestIdResponse>('/risks_management/bdf/v2/fcc_requests', request)
        .execute();
      return {
        status: status,
        requestId: data,
      };
    } catch (error) {
      return {
        status: error.response.status,
        requestId: {
          fcc_request_id: undefined,
        },
      };
    }
  }

  async getFlag(requestId: number): Promise<GetFlagResponse> {
    try {
      const { status, data } = await this._http
        .post<OneyGetFlagResponse>(`/risks_management/bdf/v2/fcc_requests/${requestId}/reply`, {
          request_cause_code: 'BQ_DIGIT',
        })
        .execute();
      return {
        status: status,
        flag: data,
      };
    } catch (error) {
      return {
        status: error.cause.status,
        flag: {
          fcc_flag: undefined,
        },
      };
    }
  }
}
