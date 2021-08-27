import { Usecase } from '@oney/ddd';
import { UpdateProfileStatusCommand } from '@oney/profile-messages';
import { Identifiers, Profile, ProfileRepositoryRead, ProfileRepositoryWrite } from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { EventProducerDispatcher } from '@oney/messages-core';

@injectable()
export class UpdateProfileStatus implements Usecase<UpdateProfileStatusCommand, Profile> {
  constructor(
    @inject(Identifiers.profileRepositoryWrite)
    private readonly profileRepositoryWrite: ProfileRepositoryWrite,
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
    @inject(EventProducerDispatcher) private readonly eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(command: UpdateProfileStatusCommand): Promise<Profile> {
    const { uid, status } = command.props;

    const profile = await this.profileRepositoryRead.getUserById(uid);
    profile.updateStatus(status);

    await this.profileRepositoryWrite.save(profile);
    await this.eventDispatcher.dispatch(profile);
    return profile;
  }
}
