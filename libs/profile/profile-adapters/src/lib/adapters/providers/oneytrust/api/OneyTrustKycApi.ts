import { AxiosHttpMethod, httpBuilder } from '@oney/http';
import * as FormData from 'form-data';
import { OneyTrustCheckSumGenerator } from '../OneyTrustCheckSumGenerator';
import { UploadDocumentResponse } from '../models/kycApi/UploadDocumentResponse';

export class OneyTrustKycApi {
  constructor(
    private readonly _oneyTrustCheckSumGenerator: OneyTrustCheckSumGenerator,
    private readonly _entityReference: number,
    private readonly _login: string,
    private readonly _oneyTrustFolderBaseApi: string,
  ) {}

  async uploadDocument(
    caseReference: string,
    file: any,
    formData: FormData,
    elementType: number,
  ): Promise<UploadDocumentResponse> {
    const checksumPayload = {
      entityReference: this._entityReference,
      caseReference: caseReference,
      content: file.buffer,
      name: file.originalname,
      elementType: elementType,
    };
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generateFileUploadChecksum(checksumPayload);

    const { data } = await httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(this._oneyTrustFolderBaseApi)
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        ...formData.getHeaders(),
      })
      .post<UploadDocumentResponse>(
        `/tulipe/v2/${this._entityReference}/cases/${caseReference}/files`,
        formData,
      )
      .execute();
    return data;
  }

  async deleteDocument({ caseReference, fileId }): Promise<void> {
    const generateCheckSum = this._oneyTrustCheckSumGenerator.generateFileDeleteChecksum({
      entityReference: this._entityReference,
      caseReference,
    });
    await httpBuilder(new AxiosHttpMethod())
      .setBaseUrl(this._oneyTrustFolderBaseApi)
      .setDefaultHeaders({
        'X-Checksum': generateCheckSum,
        'content-Type': 'application/json',
      })
      .post(`/tulipe/v2/${this._entityReference}/cases/${caseReference}/files/${fileId}/delete`, {
        login: this._login,
      })
      .execute();
  }
}
