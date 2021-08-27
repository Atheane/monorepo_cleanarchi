import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifiers } from '@oney/profile-core';
import { DocumentsReferentialGateway } from '../../domain/gateways/DocumentsReferentialGateway';
import { KycDocumentReferential } from '../../domain/types/KycDocumentReferential';

@injectable()
export class GetKycDocuments implements Usecase<void, KycDocumentReferential[]> {
  constructor(
    @inject(Identifiers.documentsReferentialGateway)
    private readonly documentsReferentialGateway: DocumentsReferentialGateway,
  ) {}

  execute(): KycDocumentReferential[] {
    return this.documentsReferentialGateway.getReferential();
  }
}
