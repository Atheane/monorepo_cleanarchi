import { Usecase } from '@oney/ddd';
import { Authorization, Identity, ServiceName } from '@oney/identity-core';
import { inject, injectable, interfaces } from 'inversify';
import { ProfileStatus } from '@oney/profile-messages';
import { Identifiers } from '../Identifiers';
import { Tips } from '../domain/aggregates/Tips';
import { ProfileRepositoryRead } from '../domain/repositories/read/ProfileRepositoryRead';
import { TipsService } from '../domain/services/TipsService';
import { TipsServiceProviders } from '../domain/types/TipsServiceProviders';
import Factory = interfaces.Factory;

interface GetTipsRequest {
  uid: string;
}

@injectable()
export class GetTips implements Usecase<GetTipsRequest, Tips> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
    @inject('Factory<TipsService>') private readonly _tipsProvider: Factory<TipsService>,
  ) {}

  async execute(request: GetTipsRequest): Promise<Tips> {
    const profile = await this.profileRepositoryRead.getUserById(request.uid);
    const tipsProvider =
      profile.props.informations.status === ProfileStatus.ACTIVE
        ? TipsServiceProviders.cdp
        : TipsServiceProviders.odb;
    const tipsService = this._tipsProvider(tipsProvider) as TipsService;
    return await tipsService.serve(profile);
  }

  async canExecute(identity: Identity, request: GetTipsRequest): Promise<boolean> {
    const scope = identity.roles.find(item => item.scope.name === ServiceName.profile);
    if (!scope) {
      return false;
    }

    if (identity.uid === request.uid && scope.permissions.read === Authorization.self) {
      return true;
    }

    return false;
  }
}
