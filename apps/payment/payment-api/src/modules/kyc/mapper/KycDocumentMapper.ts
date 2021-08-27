import { Mapper } from '@oney/common-core';
import { KycDocumentProperties } from '@oney/payment-core';
import { injectable } from 'inversify';
import { KycDocumentDto } from '../dto/KycDocumentDto';

@injectable()
export class KycDocumentMapper implements Mapper<KycDocumentProperties, KycDocumentDto> {
  fromDomain(raw: KycDocumentProperties): KycDocumentDto {
    const kycDocumentDto: KycDocumentDto = {
      uid: raw.uid,
      files: raw.files,
      ...(raw.status && { status: raw.status }),
    };

    return kycDocumentDto;
  }
}
