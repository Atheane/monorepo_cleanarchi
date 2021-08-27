import {
  DocumentsReferentialGateway,
  DocumentType,
  KycGateway,
  ProfileDocument,
  ProfileDocumentPartner,
  UploadDocumentCommand,
} from '@oney/profile-core';
import { ApiProvider } from '@oney/common-core';
import { injectable } from 'inversify';
import * as FormData from 'form-data';
import { OneytrustApis } from '../providers/oneytrust/OneytrustApiProvider';

interface kycDocumentConfig {
  elementCategory: string;
  elementSubCategory: string;
  elementType: number;
}

@injectable()
export class OneyTrustKycDocumentGateway implements KycGateway {
  constructor(
    private readonly _apiProvider: ApiProvider<OneytrustApis>,
    private readonly _login: string,
    private readonly kycDocumentsReferential: DocumentsReferentialGateway,
  ) {}

  async uploadDocument(caseReference: string, command: UploadDocumentCommand): Promise<ProfileDocument> {
    let kycDocumentConfig: kycDocumentConfig;
    if (command.documentType === DocumentType.TAX_NOTICE) {
      kycDocumentConfig = {
        elementCategory: 'INCOME',
        elementSubCategory: 'IRPP',
        elementType: 5,
      };
    } else {
      kycDocumentConfig = this.kycDocumentsReferential.getKycDocumentConf(
        command.nationality,
        command.documentType,
        command.documentSide,
      );
    }

    const form = new FormData();
    form.append('content', command.file.buffer, {
      filename: command.file.originalname,
      contentType: command.file.mimetype,
    });
    form.append('elementCategory', kycDocumentConfig.elementCategory);
    form.append('elementSubCategory', kycDocumentConfig.elementSubCategory);
    form.append('elementType', kycDocumentConfig.elementType);
    form.append('name', command.file.originalname);
    form.append('customerRank', 0);
    form.append('login', this._login);

    const result = await this._apiProvider
      .api()
      .oneyTrustKycApi.uploadDocument(caseReference, command.file, form, kycDocumentConfig.elementType);

    const kycDocument = new ProfileDocument({
      uid: result.fileIds[0],
      type: command.documentType,
      ...(command.documentSide && { side: command.documentSide }),
      partner: ProfileDocumentPartner.KYC,
      location: result.url,
    });
    return Promise.resolve(kycDocument);
  }

  async deleteDocument(caseReference: string, fileId: string): Promise<void> {
    await this._apiProvider.api().oneyTrustKycApi.deleteDocument({ caseReference, fileId });
  }
}
