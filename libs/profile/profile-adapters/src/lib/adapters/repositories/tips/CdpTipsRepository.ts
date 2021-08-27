import { ApiProvider } from '@oney/common-core';
import { Tips, TipsErrors, TipsRepositoryRead } from '@oney/profile-core';
import { injectable } from 'inversify';
import { CdpTipsMapper } from '../../mappers/CdpTipsMapper';
import { CdpApi } from '../../providers/cdp/CdpApiProvider';

@injectable()
export class CdpTipsRepository implements TipsRepositoryRead {
  constructor(
    private readonly _apiProvider: ApiProvider<CdpApi>,
    private readonly _tipsMapper: CdpTipsMapper,
  ) {}

  async get(uid: string): Promise<Tips> {
    const cdpTips = await this._apiProvider.api().tipsApi.get(uid);
    if (cdpTips.erreur) {
      throw new TipsErrors.NoTipsForUser('NO_TIPS_FOR_USER');
    }
    return this._tipsMapper.toDomain(cdpTips);
  }
}
