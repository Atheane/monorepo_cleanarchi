import { ApiProvider } from '@oney/common-core';
import { FccGateway, Profile, Fcc, FccResquestId } from '@oney/profile-core';
import { OneyFccApi } from '../providers/oneyFcc/api/OneyFccApi';
import { OneyFccMapper } from '../mappers/OneyFccMapper';

export class OneyFccGateway implements FccGateway {
  constructor(
    private readonly _apiProvider: ApiProvider<OneyFccApi>,
    private readonly _oneyFccMapper: OneyFccMapper,
    private readonly _partnerGuid: string,
  ) {}
  async getRequestId(request: Profile): Promise<FccResquestId> {
    const requestIdResponse = await this._apiProvider.api().getRequestId(
      this._oneyFccMapper.fromDomain({
        profile: request,
        partner_guid: this._partnerGuid,
      }),
    );
    return {
      status: requestIdResponse.status,
      result:
        requestIdResponse.requestId.fcc_request_id === undefined
          ? undefined
          : parseInt(requestIdResponse.requestId.fcc_request_id),
    };
  }

  async getFlag(request: number): Promise<Fcc> {
    const flagResponse = await this._apiProvider.api().getFlag(request);
    return {
      status: flagResponse.status,
      result:
        flagResponse.flag.fcc_flag === undefined ? undefined : Boolean(parseInt(flagResponse.flag.fcc_flag)),
    };
  }
}
