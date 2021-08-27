import { getEnumKeyByEnumValue, Mapper } from '@oney/common-core';
import { FileExtensions, File, IdTypes, KycDocument, KycDocumentStatus } from '@oney/payment-core';
import {
  SmoneyIdTypes,
  SmoneyKycDocumentRequest,
} from '../partners/smoney/models/kyc/SmoneyKycDocumentRequest';
import {
  ODBKycResponse,
  SmoneyKycDocumentResponse,
} from '../partners/smoney/models/kyc/SmoneyKycDocumentResponse';
import { SmoneyKycFileRequest } from '../partners/smoney/models/kyc/SmoneyKycFile';

export class SmoneyKycDocumentMapper
  implements Mapper<KycDocument, SmoneyKycDocumentRequest | SmoneyKycDocumentResponse> {
  toDomain(response: ODBKycResponse): KycDocument {
    const files: File[] = [];

    for (const file of response.files) {
      const extString = file.name.split('.')[1] as FileExtensions;

      const odbIdType = file.name.split('.')[0] as IdTypes;

      files.push({
        type: odbIdType,
        extString,
      });
    }

    return new KycDocument({
      uid: response.uid,
      status: response.status as KycDocumentStatus,
      files,
    });
  }

  fromDomain(kycDocument: KycDocument): SmoneyKycDocumentRequest {
    const smoneyIdType = SmoneyIdTypes[getEnumKeyByEnumValue(IdTypes, kycDocument.props.files[0].type)];

    const rectoFile = kycDocument.props.files[0];
    const versoFile = kycDocument.props.files[1];

    /* istanbul ignore else */
    if (rectoFile.extString === FileExtensions.JPG) {
      rectoFile.extString = FileExtensions.JPEG;
    }

    const files: [SmoneyKycFileRequest] = [
      {
        name: `${rectoFile.type}.${rectoFile.extString}`,
        content: Buffer.from(rectoFile.file).toString('base64'),
      },
    ];
    // Waiting to find a mock solution for test else case.
    /* istanbul ignore else */
    if (versoFile) {
      /* istanbul ignore else */
      if (versoFile.extString === FileExtensions.JPG) {
        versoFile.extString = FileExtensions.JPEG;
      }
      files.push({
        name: `${versoFile.type}.${versoFile.extString}`,
        content: Buffer.from(versoFile.file).toString('base64'),
      });
    }

    return {
      uid: kycDocument.id,
      type: smoneyIdType,
      files,
    };
  }
}
