import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { StrongAuthVerifier } from '../../domain/entities/StrongAuthVerifier';
import { ScaVerifierGateway } from '../../domain/gateways/ScaVerifierGateway';
import { VerifierRepository } from '../../domain/repositories/VerifierRepository';
import { AuthIdentifier } from '../AuthIdentifier';

export interface VerifyCredentialsCommand {
  verifierId: string;
  credential?: string;
}

@injectable()
export class VerifyCredentials implements Usecase<VerifyCredentialsCommand, StrongAuthVerifier> {
  constructor(
    @inject(AuthIdentifier.verifierRepository) private readonly verifierRepository: VerifierRepository,
    @inject(AuthIdentifier.verifierService) private readonly verifierGateway: ScaVerifierGateway,
  ) {}

  async execute(request: VerifyCredentialsCommand): Promise<StrongAuthVerifier> {
    const verifier = await this.verifierRepository.findById(request.verifierId);
    const checkVerifierCredentials = await this.verifierGateway.verify(verifier, request.credential);
    return (await this.verifierRepository.save(checkVerifierCredentials)) as StrongAuthVerifier<any>;
    // return this.restrictedVerifierMapper.toDomain(updatedVerifier);
  }
}
