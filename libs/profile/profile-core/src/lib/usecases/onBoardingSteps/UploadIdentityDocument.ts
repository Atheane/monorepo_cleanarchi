import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { DocumentSide, FolderGateway, ProfileDocument, ProfileDocumentPartner } from '@oney/profile-core';
import { CountryCode, ProfileStatus } from '@oney/profile-messages';
import { Identifiers } from '../../Identifiers';
import { StorageGateway } from '../../domain/gateways/StorageGateway';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { Profile } from '../../domain/aggregates/Profile';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { KycGateway } from '../../domain/gateways/KycGateway';
import { DocumentType } from '../../domain/types/DocumentType';
import { IdGenerator } from '../../domain/gateways/IdGenerator';

export class UploadIdentityDocumentCommand {
  uid: string;
  file: any;
  documentSide?: DocumentSide;
  documentType: DocumentType;
  nationality: CountryCode;
}

@injectable()
export class UploadIdentityDocument implements Usecase<UploadIdentityDocumentCommand, Profile> {
  constructor(
    @inject(Identifiers.storageGateway) private readonly _storageGateway: StorageGateway,
    @inject(Identifiers.kycGateway) private readonly _kycGateway: KycGateway,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(Identifiers.idGenerator) private readonly _idGenerator: IdGenerator,
    @inject(Identifiers.folderGateway) private readonly _folderGateway: FolderGateway,
    @inject(Identifiers.featureFlagProfileStatusSaga) private readonly isProfileStatusSagaActive: boolean,
  ) {}

  async execute(request: UploadIdentityDocumentCommand): Promise<Profile> {
    const profile = await this._profileRepositoryRead.getUserById(request.uid);

    const oldOdbDocument = profile.props.documents.find(
      document =>
        document.props.partner === ProfileDocumentPartner.ODB &&
        document.props.type === request.documentType &&
        document.props.side === request.documentSide,
    );
    if (oldOdbDocument) profile.deleteDocument(oldOdbDocument);

    const odbIdDocument = await this.storeDocument(profile.props.uid, request);
    profile.addDocument(odbIdDocument);

    const oldKycDocument = await this.deleteDocumentFromKycIfExists(
      profile.props.documents,
      profile.props.kyc.caseReference,
      request,
    );
    if (oldKycDocument) profile.deleteDocument(oldKycDocument);

    const kycIdDocument = await this._kycGateway.uploadDocument(profile.props.kyc.caseReference, request);
    profile.addDocument(kycIdDocument);

    if (profile.props.informations.status === ProfileStatus.ACTION_REQUIRED_ID)
      await this._folderGateway.askForDecision(profile.props.kyc.caseReference);

    profile.validateIdentityDocument(request.nationality);
    if (!this.isProfileStatusSagaActive) {
      profile.updateStatus();
    }

    await this._profileRepositoryWrite.save(profile);
    await this._eventDispatcher.dispatch(profile);
    return profile;
  }

  private async storeDocument(profileId: string, request: UploadIdentityDocumentCommand) {
    const odbIdDocument = new ProfileDocument({
      uid: this._idGenerator.generateUniqueID(),
      type: request.documentType,
      side: request.documentSide,
      partner: ProfileDocumentPartner.ODB,
      location: null,
    });
    odbIdDocument.props.location = await this._storageGateway.storeDocument(
      odbIdDocument.createDocumentName(profileId, request.file.mimetype, Date.now().toString()),
      request.file,
    );
    return odbIdDocument;
  }

  private async deleteDocumentFromKycIfExists(
    documents: ProfileDocument[],
    caseReference: string,
    request: UploadIdentityDocumentCommand,
  ) {
    const oldKycDocument = documents.find(
      document =>
        document.props.partner === ProfileDocumentPartner.KYC &&
        document.props.type === request.documentType &&
        document.props.side === request.documentSide,
    );
    if (oldKycDocument) {
      await this._kycGateway.deleteDocument(caseReference, oldKycDocument.props.uid);
    }
    return oldKycDocument;
  }

  canExecute(identity: Identity, request: any): Promise<boolean> | boolean {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    return identity.uid === request.uid && scope.permissions.write === Authorization.self;
  }
}
