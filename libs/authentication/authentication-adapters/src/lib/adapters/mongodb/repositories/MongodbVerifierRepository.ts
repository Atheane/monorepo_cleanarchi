import { AuthenticationError, StrongAuthVerifier, VerifierRepository } from '@oney/authentication-core';
import { AuthStatus } from '@oney/identity-core';
import { injectable } from 'inversify';
import { Model } from 'mongoose';
import { StrongAuthVerifierDoc, StrongAuthVerifierModel } from '../models/strongAuthVerifier.schema';
// Case cover in Authentication-api
/* istanbul ignore next */
@injectable()
export class MongodbVerifierRepository implements VerifierRepository {
  private authVerifierModel: Model<StrongAuthVerifierDoc>;

  constructor() {
    this.authVerifierModel = StrongAuthVerifierModel;
  }

  async save(authVerifier: StrongAuthVerifier): Promise<StrongAuthVerifier> {
    const result = await this._executeVerifierUpsertQuery(authVerifier);
    return new StrongAuthVerifier(result);
  }

  async findById(verifierId: string): Promise<StrongAuthVerifier> {
    const filter = { verifierId };
    const result = await this.authVerifierModel.findOne(filter).select('-_id').lean();
    if (!result) return this._rejectVerifierNotFoundError();
    return new StrongAuthVerifier(result);
  }

  private _rejectVerifierNotFoundError(): Promise<never> {
    return Promise.reject(new AuthenticationError.VerifierNotFound('VERIFIER_NOT_FOUND'));
  }

  async findLatestBlockedByUserId(userId: string): Promise<StrongAuthVerifier> {
    const result = await this._executeLatestBlockedVerifierQuery(userId);
    if (!result) return this._rejectBlockedVerifierNotFoundError();
    return new StrongAuthVerifier(result);
  }

  private _rejectBlockedVerifierNotFoundError(): Promise<never> {
    return Promise.reject(new AuthenticationError.VerifierNotFound('BLOCKED_VERIFIER_NOT_FOUND'));
  }

  private async _executeVerifierUpsertQuery(v: StrongAuthVerifier) {
    const filter = { verifierId: v.verifierId };
    const update = { ...v, updatedAt: new Date() };
    const options = { new: true, upsert: true };
    return await this.authVerifierModel.findOneAndUpdate(filter, update, options).select('-_id').lean();
  }

  private async _executeLatestBlockedVerifierQuery(userId: string) {
    const filter = { 'customer.uid': userId, status: AuthStatus.BLOCKED };
    const unblockingDateField = 'metadatas.icgAuthInitResult.unblockingDate';
    return await this.authVerifierModel
      .findOne(filter)
      .exists(unblockingDateField)
      .sort({ updatedAt: -1 })
      .select('-_id')
      .lean();
  }
}
