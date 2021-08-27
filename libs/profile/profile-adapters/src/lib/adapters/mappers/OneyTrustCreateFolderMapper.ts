import { Mapper } from '@oney/common-core';
import { CreateFolderRequest } from '@oney/profile-core';
import { injectable } from 'inversify';
import {
  CreateOneyTrustFolderRequest,
  OneytrustChannel,
} from '../providers/oneytrust/models/acquisitionsApi/CreateOneyTrustFolderRequest';

@injectable()
export class OneyTrustCreateFolderMapper
  implements Mapper<CreateFolderRequest, CreateOneyTrustFolderRequest> {
  constructor(
    private readonly _entityReference: number,
    private readonly _caseType: number,
    private readonly _language: string,
    private readonly _flagCallbackUrlInPayload: boolean,
    private readonly _oneytrustCallbackDecisionUrl: string,
  ) {}

  fromDomain(request: CreateFolderRequest): CreateOneyTrustFolderRequest {
    const update = {
      caseReference: request.caseReference,
      masterReference: request.masterReference,
      entityReference: this._entityReference,
      caseType: this._caseType,
      language: this._language,
      channel: OneytrustChannel.APP,
      ...(this._flagCallbackUrlInPayload && {
        callbackUrl: this._oneytrustCallbackDecisionUrl,
      }),
      formData: {
        email: request.email,
        phone: request.phone,
      },
    };

    return update;
  }
}
