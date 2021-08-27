import { Tips, TipsRepositoryRead } from '@oney/profile-core';
import { ProfileStatus } from '@oney/profile-messages';
import { injectable } from 'inversify';
import { OdbTipsProvider } from '../../providers/odb/tips/OdbTipsProvider';

@injectable()
export class OdbTipsRepository implements TipsRepositoryRead {
  private readonly _odbTipsProvider: OdbTipsProvider = new OdbTipsProvider();

  get(uid: string, status: ProfileStatus): Promise<Tips> {
    return this._odbTipsProvider.render(uid, status);
  }
}
