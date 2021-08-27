import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../Identifiers';
import { ProfileRepositoryWrite } from '../../domain/repositories/write/ProfileRepositoryWrite';
import { ProfileRepositoryRead } from '../../domain/repositories/read/ProfileRepositoryRead';

export interface ValidateSubscriptionStepRequest {
  uid: string;
}

@injectable()
export class ValidateSubscriptionStep implements Usecase<ValidateSubscriptionStepRequest, void> {
  constructor(
    @inject(Identifiers.profileRepositoryRead) private readonly profileRepositoryRead: ProfileRepositoryRead,
    @inject(Identifiers.profileRepositoryWrite)
    private readonly _profileRepositoryWrite: ProfileRepositoryWrite,
  ) {}

  async execute(request: ValidateSubscriptionStepRequest): Promise<void> {
    const { uid } = request;
    const profile = await this.profileRepositoryRead.getUserById(uid);
    profile.validateSubscriptionStep();
    await this._profileRepositoryWrite.save(profile);
  }
}
