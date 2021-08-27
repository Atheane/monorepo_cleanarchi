import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable } from 'inversify';
import { KycDecisionType, ProfileDocumentPartner, ProfileStatus } from '@oney/profile-messages';
import { EventProducerDispatcher } from '@oney/messages-core';
import { Identifiers } from '../../Identifiers';
import { StorageGateway } from '../../domain/gateways/StorageGateway';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { Profile } from '../../domain/aggregates/Profile';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { KycGateway } from '../../domain/gateways/KycGateway';
import { DocumentType } from '../../domain/types/DocumentType';
import { IdGenerator } from '../../domain/gateways/IdGenerator';
import { FolderGateway } from '../../domain/gateways/FolderGateway';
import { ProfileDocument } from '../../domain/aggregates/ProfileDocument';

export class UploadTaxNoticeCommand {
  uid: string;
  file: any;
}

@injectable()
export class UploadTaxNotice implements Usecase<UploadTaxNoticeCommand, Profile> {
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

  canExecute(identity: Identity, request: any): Promise<boolean> | boolean {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }
    return identity.uid === request.uid && scope.permissions.write === Authorization.self;
  }

  async execute(request: UploadTaxNoticeCommand): Promise<Profile> {
    const profile = await this._profileRepositoryRead.getUserById(request.uid);
    const caseReference = await this._createNewKycFolderIfNeeded(profile);

    const odbDocument = await this._storeDocument(profile.props.uid, request);
    profile.addDocument(odbDocument);

    const kycDocument = await this._kycGateway.uploadDocument(caseReference, {
      uid: request.uid,
      file: request.file,
      documentType: DocumentType.TAX_NOTICE,
    });
    profile.addDocument(kycDocument);
    profile.uploadTaxNotice(odbDocument);
    if (!this.isProfileStatusSagaActive) {
      if (
        profile.props.informations.status === ProfileStatus.ACTION_REQUIRED_TAX_NOTICE &&
        profile.props.kyc.taxNoticeUploaded
      ) {
        profile.updateStatus();
      }
    }
    await this._folderGateway.askForDecision(caseReference);

    await this._profileRepositoryWrite.save(profile);
    await this._eventDispatcher.dispatch(profile);
    return profile;
  }

  private async _storeDocument(profileId: string, request: UploadTaxNoticeCommand) {
    const odbDocument = new ProfileDocument({
      uid: this._idGenerator.generateUniqueID(),
      type: DocumentType.TAX_NOTICE,
      partner: ProfileDocumentPartner.ODB,
      location: null,
    });
    odbDocument.props.location = await this._storageGateway.storeDocument(
      odbDocument.createDocumentName(profileId, request.file.mimetype, Date.now().toString()),
      request.file,
    );
    return odbDocument;
  }

  private async _deleteDocumentFromKycIfExists(documents: ProfileDocument[], caseReference: string) {
    const oldKycDocument = documents.find(
      document =>
        document.props.partner === ProfileDocumentPartner.KYC &&
        document.props.type === DocumentType.TAX_NOTICE,
    );
    if (oldKycDocument) {
      await this._kycGateway.deleteDocument(caseReference, oldKycDocument.props.uid);
    }
    return oldKycDocument;
  }

  private async _createNewKycFolderIfNeeded(profile: Profile): Promise<string> {
    const finalKycDecision = [KycDecisionType.OK_MANUAL, KycDecisionType.OK, KycDecisionType.KO_MANUAL];
    const isOnboardingKYC = !profile.props.kyc.versions;
    if (!isOnboardingKYC || (isOnboardingKYC && !finalKycDecision.includes(profile.props.kyc.decision))) {
      const oldDocument = await this._deleteDocumentFromKycIfExists(
        profile.props.documents,
        profile.props.kyc.caseReference,
      );
      if (oldDocument) profile.deleteDocument(oldDocument);
      return profile.props.kyc.caseReference;
    } else {
      const now = new Date();
      const caseReference = `SP_${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}_${
        profile.props.uid
      }_${this._idGenerator.generateUniqueID()}`;
      const newCase = await this._folderGateway.createNewCase({
        caseReference,
        uid: profile.props.uid,
      });
      profile.createNewKyc(caseReference, newCase.caseId);
      await this._folderGateway.sendDataToNewCase(profile);
      return caseReference;
    }
  }
}
