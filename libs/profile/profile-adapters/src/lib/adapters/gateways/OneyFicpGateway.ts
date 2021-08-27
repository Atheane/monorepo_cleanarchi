import { Ficp, FicpGateway, FicpRequestId, Profile } from '@oney/profile-core';
import { ApiProvider } from '@oney/common-core';
import { OneyFicpApi } from '../providers/OneyFicp/api/OneyFicpApi';
import { OneyFicpMapper } from '../mappers/OneyFicpMapper';

export class OneyFicpGateway implements FicpGateway {
  constructor(
    private readonly _apiProvider: ApiProvider<OneyFicpApi>,
    private readonly _oneyFicpMapper: OneyFicpMapper,
    private readonly _partnerGuid: string,
  ) {}

  async getRequestId(profile: Profile): Promise<FicpRequestId> {
    const requestIdResponse = await this._apiProvider.api().getRequestId(
      this._oneyFicpMapper.fromDomain({
        profile: profile,
        partner_guid: this._partnerGuid,
      }),
    );

    return {
      status: requestIdResponse.status,
      result: requestIdResponse.requestId.ficp_request_id
        ? Number(requestIdResponse.requestId.ficp_request_id)
        : undefined,
    };
  }

  async getFlag(requestId: number): Promise<Ficp> {
    const flagResponse = await this._apiProvider.api().getFlag(requestId);

    return {
      status: flagResponse.status,
      result: Boolean(parseInt(flagResponse.flag.ficp_flag)),
    };
  }
}
