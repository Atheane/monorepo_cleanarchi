import { ApiProvider } from '@oney/common-core';
import { FacematchGateway, SendFacematchRequest } from '@oney/profile-core';
import { injectable } from 'inversify';
import { OneytrustApis } from '../providers/oneytrust/OneytrustApiProvider';

@injectable()
export class OneytrustFacematchGateway implements FacematchGateway {
  constructor(private readonly _apiProvider: ApiProvider<OneytrustApis>) {}

  async sendFacematch(request: SendFacematchRequest): Promise<void> {
    await this._apiProvider.api().OneytrustFacematchApi.sendFacematch(request);
  }
}
