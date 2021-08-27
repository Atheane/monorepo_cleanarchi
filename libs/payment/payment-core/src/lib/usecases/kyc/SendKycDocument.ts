import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { KycDecisionDocument } from '@oney/profile-messages';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { KycDocumentProperties } from '../../domain/aggregates/KycDocument';
import { KycGateway } from '../../domain/gateways/KycGateway';
import { StorageGateway } from '../../domain/gateways/StorageGateway';

export class SendKycDocumentRequest {
  uid: string;
  documents: KycDecisionDocument[];
}

@injectable()
export class SendKycDocument implements Usecase<SendKycDocumentRequest, KycDocumentProperties> {
  constructor(
    @inject(PaymentIdentifier.kycGateway) private readonly _kycGateway: KycGateway,
    @inject(PaymentIdentifier.storageGateway) private readonly _storageGateway: StorageGateway,
  ) {}

  async execute(request: SendKycDocumentRequest): Promise<KycDocumentProperties> {
    const files = await this._storageGateway.getFiles(request.uid, request.documents);

    const createdKycDocument = await this._kycGateway.createDocument(files);

    return createdKycDocument.props;
  }
}
