import { StrongAuthVerifier } from '../entities/StrongAuthVerifier';

export interface VerifierRepository {
  save(authVerifier: StrongAuthVerifier): Promise<StrongAuthVerifier>;
  findById(verifierId: string): Promise<StrongAuthVerifier>;
  findLatestBlockedByUserId(userId: string): Promise<StrongAuthVerifier>;
}
