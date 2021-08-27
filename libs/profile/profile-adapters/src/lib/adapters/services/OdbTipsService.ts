import { Identifiers, Profile, Tips, TipsService, TipsRepositoryRead } from '@oney/profile-core';
import { inject, injectable } from 'inversify';

@injectable()
export class OdbTipsService implements TipsService {
  constructor(@inject(Identifiers.tipsRepositoryRead) private readonly _tipsRepository: TipsRepositoryRead) {}

  async serve(profile: Profile): Promise<Tips> {
    return await this._tipsRepository.get(profile.props.uid, profile.props.informations.status);
  }
}
