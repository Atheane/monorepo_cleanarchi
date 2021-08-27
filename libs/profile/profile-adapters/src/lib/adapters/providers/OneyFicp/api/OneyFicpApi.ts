import { IHttpBuilder } from '@oney/http';
import {
  GetFicpFlagResponse,
  GetFicpRequestIdCommand,
  GetFicpRequestIdResponse,
  OneyGetFicpFlagResponse,
  OneyGetFicpRequestIdResponse,
} from '../models/FicpModels';

export class OneyFicpApi {
  constructor(private readonly _http: IHttpBuilder, private readonly _cypherDecipherHttp: IHttpBuilder) {}

  async getRequestId(request: GetFicpRequestIdCommand): Promise<GetFicpRequestIdResponse> {
    try {
      const { data, status } = await this._cypherDecipherHttp
        .setAdditionnalHeaders({
          'X-Oney-Secret': 'Method-body',
        })
        .post<OneyGetFicpRequestIdResponse>('risks_management/bdf/v2/ficp_requests', request)
        .execute();

      return {
        status: status,
        requestId: data,
      };
    } catch (error) {
      return {
        status: error.response.status,
        requestId: {
          ficp_request_id: undefined,
        },
      };
    }
  }

  async getFlag(ficpRequestId: number): Promise<GetFicpFlagResponse> {
    try {
      const { data, status } = await this._http
        .post<OneyGetFicpFlagResponse>(`risks_management/bdf/v2/ficp_requests/${ficpRequestId}/reply`, {
          request_cause_code: 'BQ_DIGIT',
        })
        .execute();

      return {
        flag: data,
        status: status,
      };
    } catch (error) {
      return {
        flag: {
          ficp_flag: undefined,
        },
        status: error.cause.status,
      };
    }
  }
}
