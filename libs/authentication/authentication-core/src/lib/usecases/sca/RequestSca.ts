import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { StrongAuthVerifier } from '../../domain/entities/StrongAuthVerifier';
import { ScaVerifierGateway } from '../../domain/gateways/ScaVerifierGateway';
import { AuthenticationError } from '../../domain/models/AuthenticationError';
import { VerifierRepository } from '../../domain/repositories/VerifierRepository';
import { Action } from '../../domain/valueobjects/Action';
import { AuthIdentifier } from '../AuthIdentifier';

export interface RequestAuthCommand {
  userId: string;
  action?: Action;
  byPassPinCode?: boolean;
}

@injectable()
export class RequestSca implements Usecase<RequestAuthCommand, StrongAuthVerifier> {
  constructor(
    @inject(AuthIdentifier.verifierRepository) private readonly verifierRepository: VerifierRepository,
    @inject(AuthIdentifier.verifierService) private readonly verifierGateway: ScaVerifierGateway,
  ) {}

  async execute(request: RequestAuthCommand): Promise<StrongAuthVerifier> {
    try {
      const authVerifier = await this.verifierGateway.generateVerifier(
        request.userId,
        request.action,
        request.byPassPinCode,
      );
      await this.verifierRepository.save(authVerifier);
      return authVerifier;
    } catch (error) {
      if (error instanceof AuthenticationError.AuthInitAuthenticationLocked) {
        const blockedVerifier = await this.verifierRepository.findLatestBlockedByUserId(error.cause.uid);
        const {
          metadatas: { icgAuthInitResult },
        } = new StrongAuthVerifier<{ icgAuthInitResult: { unblockingDate: Date } }>(blockedVerifier);
        error.cause.unblockingDate = icgAuthInitResult.unblockingDate;
        throw error;
      }

      throw error;
    }
  }
}
