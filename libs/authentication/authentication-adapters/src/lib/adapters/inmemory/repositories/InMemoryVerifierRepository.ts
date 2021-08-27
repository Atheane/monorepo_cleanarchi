import {
  AuthenticationError,
  AuthStatus,
  StrongAuthVerifier,
  VerifierRepository,
} from '@oney/authentication-core';
import { injectable } from 'inversify';

export type TestVerifier = StrongAuthVerifier<{ [x: string]: { unblockingDate: Date } }> & {
  updateDate: number;
};

@injectable()
export class InMemoryVerifierRepository implements VerifierRepository {
  constructor(private store: Map<string, StrongAuthVerifier>) {}

  async findById(verifierId: string): Promise<StrongAuthVerifier> {
    const verifier = this.store.get(verifierId);
    if (!verifier) return this._rejectVerifierNotFoundError();
    return new StrongAuthVerifier(verifier);
  }

  private _rejectVerifierNotFoundError(): Promise<never> {
    return Promise.reject(new AuthenticationError.VerifierNotFound('VERIFIER_NOT_FOUND'));
  }

  async save(authVerifier: StrongAuthVerifier): Promise<StrongAuthVerifier> {
    this.store.set(authVerifier.verifierId, { ...authVerifier, updateDate: Date.now() } as TestVerifier);
    return this.findById(authVerifier.verifierId);
  }

  async findLatestBlockedByUserId(userId: string): Promise<StrongAuthVerifier> {
    const blockedVerifiers = this._findBlockedVerifiers(userId);
    const sortedBlockedVerifiers = this._orderDescByUpdateDate(blockedVerifiers) as TestVerifier[];
    const latestUpdatedVerifier = sortedBlockedVerifiers[0];
    const hasUnblockingDate = !!latestUpdatedVerifier.metadatas.icgAuthInitResult.unblockingDate;
    if (!hasUnblockingDate) return this._rejectBlockedVerifierNotFoundError();
    return Promise.resolve(new StrongAuthVerifier(latestUpdatedVerifier));
  }

  private _rejectBlockedVerifierNotFoundError(): Promise<never> {
    return Promise.reject(new AuthenticationError.VerifierNotFound('BLOCKED_VERIFIER_NOT_FOUND'));
  }

  private _findBlockedVerifiers(uid: string): StrongAuthVerifier[] {
    return [...this.store.values()].filter(ver => this._belongsTo(uid, ver) && this._isBlocked(ver));
  }

  private _isBlocked(verifier: StrongAuthVerifier): boolean {
    return verifier.status === AuthStatus.BLOCKED;
  }

  private _belongsTo(uid: string, verifier: StrongAuthVerifier): boolean {
    return verifier.customer.uid === uid;
  }

  private _orderDescByUpdateDate(verifiers: StrongAuthVerifier[]): StrongAuthVerifier[] {
    return verifiers.sort(
      (authVerifier1: TestVerifier, authVerifier2: TestVerifier) =>
        authVerifier2.updateDate - authVerifier1.updateDate,
    ) as TestVerifier[];
  }
}
