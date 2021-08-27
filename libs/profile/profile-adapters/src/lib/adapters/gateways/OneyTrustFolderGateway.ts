import {
  BankAccountIdentityRequest,
  CreateFolderRequest,
  CreateFolderResponse,
  CreateNewCaseRequest,
  CreateNewCaseResponse,
  FolderGateway,
  Profile,
} from '@oney/profile-core';
import { injectable } from 'inversify';
import { ApiProvider } from '@oney/common-core';
import { OneytrustApis } from '../providers/oneytrust/OneytrustApiProvider';
import { OneyTrustUpdateFolderMapper } from '../mappers/OneyTrustUpdateFolderMapper';
import { OneyTrustCreateFolderMapper } from '../mappers/OneyTrustCreateFolderMapper';
import { OneyTrustVerifyBankAccountOwnerMapper } from '../mappers/OneyTrustVerifyBankAccountOwnerMapper';
import {
  OneytrustEventDecision,
  OneytrustEventScoreStatus,
} from '../providers/oneytrust/models/caseApi/OneyTrustEventResponse';
import {
  caseType,
  OneytrustNewCaseChannel,
  OneytrustNewCaseLanguage,
} from '../providers/oneytrust/models/caseApi/OneyTrustNewCaseRequest';
import { UpdateOneyTrustCaseRequest } from '../providers/oneytrust/models/caseApi/UpdateOneyTrustCaseRequest';

@injectable()
export class OneyTrustFolderGateway implements FolderGateway {
  constructor(
    private readonly _apiProvider: ApiProvider<OneytrustApis>,
    private readonly _entityReference: number,
    private readonly _caseType: number,
    private readonly _language: string,
    private readonly _flagCallbackUrlInPayload: boolean,
    private readonly _oneytrustCallbackDecisionUrl: string,
  ) {}

  async update(profile: Profile): Promise<Profile> {
    await this._apiProvider
      .api()
      .oneyTrustCaseApi.updateFolder(new OneyTrustUpdateFolderMapper().fromDomain(profile));
    return profile;
  }

  async create(request: CreateFolderRequest): Promise<CreateFolderResponse> {
    const response = await this._apiProvider
      .api()
      .oneyTrustAcquisitionsApi.createFolder(
        new OneyTrustCreateFolderMapper(
          this._entityReference,
          this._caseType,
          this._language,
          this._flagCallbackUrlInPayload,
          this._oneytrustCallbackDecisionUrl,
        ).fromDomain(request),
      );
    return response;
  }

  async createNewCase(request: CreateNewCaseRequest): Promise<CreateNewCaseResponse> {
    const response = await this._apiProvider.api().oneyTrustCaseApi.createCase({
      caseReference: request.caseReference,
      masterReference: request.uid,
      caseType: caseType.TAX_NOTICE,
      channel: OneytrustNewCaseChannel.APP,
      language: OneytrustNewCaseLanguage.FR,
    });
    return response;
  }

  async sendDataToNewCase(profile: Profile): Promise<Profile> {
    const request: UpdateOneyTrustCaseRequest = {
      ...new OneyTrustUpdateFolderMapper().fromDomain(profile),
      email: profile.props.email,
      phone: profile.props.informations.phone,
    };
    await this._apiProvider.api().oneyTrustCaseApi.updateFolder(request, true);
    return profile;
  }

  async askForDecision(caseReference: string): Promise<void> {
    await this._apiProvider.api().oneyTrustCaseApi.askForDecision(caseReference);
  }

  async isBankAccountOwner(request: BankAccountIdentityRequest): Promise<boolean> {
    const result = await this._apiProvider
      .api()
      .oneyTrustCaseApi.customerCaseEvents(new OneyTrustVerifyBankAccountOwnerMapper().fromDomain(request));

    return (
      result.scoreStatus === OneytrustEventScoreStatus.DONE &&
      result.decision === OneytrustEventDecision.MATCH
    );
  }
}
