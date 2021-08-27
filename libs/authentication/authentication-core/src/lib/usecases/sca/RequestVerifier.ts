import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { StrongAuthVerifier } from '../../domain/entities/StrongAuthVerifier';
import { ScaVerifierGateway } from '../../domain/gateways/ScaVerifierGateway';
import { VerifierRepository } from '../../domain/repositories/VerifierRepository';
import { AuthStatus } from '../../domain/types/AuthStatus';
import { AuthIdentifier } from '../AuthIdentifier';

export interface RequestVerifierCommand {
  verifierId: string;
}

@injectable()
export class RequestVerifier implements Usecase<RequestVerifierCommand, StrongAuthVerifier> {
  constructor(
    @inject(AuthIdentifier.verifierRepository) private readonly verifierRepository: VerifierRepository,
    @inject(AuthIdentifier.verifierService) private readonly verifierGateway: ScaVerifierGateway,
  ) {}

  async execute(request: RequestVerifierCommand): Promise<StrongAuthVerifier> {
    const verifier = await this.verifierRepository.findById(request.verifierId);
    if (verifier.isVerifierExpired()) {
      return this.verifierRepository.save(
        new StrongAuthVerifier({
          ...verifier,
          status: AuthStatus.EXPIRED,
          valid: false,
        }),
      );
    }
    return verifier;
  }
}
