import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { ProfileActivationType } from '@oney/profile-messages';
import { ProfileStatus } from '@oney/profile-messages';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';
import { Identifiers } from '../../Identifiers';

export type ActivateProfileWithAggregationCommand = {
  userId: string;
  isOwnerBankAccount: boolean;
};

@injectable()
export class ActivateProfileWithAggregation implements Usecase<ActivateProfileWithAggregationCommand, void> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly _profileRepositoryRead: ProfileRepositoryRead,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: ActivateProfileWithAggregationCommand): Promise<void> {
    const profile = await this._profileRepositoryRead.getUserById(request.userId);

    if (
      profile.props.informations.status === ProfileStatus.ACTION_REQUIRED_ACTIVATE &&
      request.isOwnerBankAccount
    ) {
      profile.activate(ProfileActivationType.AGGREGATION);

      await this._profileRepositoryWrite.save(profile);

      await this.eventDispatcher.dispatch(profile);
    }
  }
}
