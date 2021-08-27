import { IHttpBuilder } from '@oney/http';
import {
  DiligenceStatus,
  DiligenceType,
  SmoneyKycComplementaryDiligenceRequest,
  SmoneyKycComplementaryDiligenceRequestPayload,
} from '../models/kyc/SmoneyKycComplementaryDiligence';
import { SmoneyKycDocumentRequest } from '../models/kyc/SmoneyKycDocumentRequest';
import { SmoneyKycDocumentResponse } from '../models/kyc/SmoneyKycDocumentResponse';
import { SmoneyKycFiltersRequest } from '../models/kyc/SmoneyKycFiltersRequest';

export enum SmoneyKycUri {
  ATTACHMENTS = 'kyc/attachments',
  COMPLEMENTARY_DILIGENCE = 'kyc/complementarydiligence',
}

export class SmoneyKycApi {
  constructor(private readonly _http: IHttpBuilder) {}

  async sendDocument(request: SmoneyKycDocumentRequest): Promise<SmoneyKycDocumentResponse> {
    const { uid, ...body } = request;
    const { data } = await this._http
      .post<SmoneyKycDocumentResponse>(`users/${uid}/${SmoneyKycUri.ATTACHMENTS}`, body)
      .execute();
    return data;
  }

  async setFilters(request: SmoneyKycFiltersRequest): Promise<void> {
    const { uid, ...body } = request;
    await this._http.patch(`user/${uid}/sanctionpperesults`, body).execute();
  }

  async createComplementaryDiligence({ appUserId }: SmoneyKycComplementaryDiligenceRequest): Promise<void> {
    const body: SmoneyKycComplementaryDiligenceRequestPayload = {
      type: DiligenceType.ACCOUNT_AGGREGATION,
      status: DiligenceStatus.VALIDATED,
    };

    await this._http.post<void>(`users/${appUserId}/${SmoneyKycUri.COMPLEMENTARY_DILIGENCE}`, body).execute();
  }
}
