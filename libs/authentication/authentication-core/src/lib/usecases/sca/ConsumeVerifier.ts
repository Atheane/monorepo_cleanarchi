import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { StrongAuthVerifier } from '../../domain/entities/StrongAuthVerifier';
import { ScaVerifierGateway } from '../../domain/gateways/ScaVerifierGateway';
import { VerifierRepository } from '../../domain/repositories/VerifierRepository';
import { AuthIdentifier } from '../AuthIdentifier';

export interface ConsumeVerifierCommand {
  verifierId: string;
}

@injectable()
export class ConsumeVerifier implements Usecase<ConsumeVerifierCommand, StrongAuthVerifier> {
  constructor(
    @inject(AuthIdentifier.verifierRepository) private readonly verifierRepository: VerifierRepository,
    @inject(AuthIdentifier.verifierService) private readonly verifierGateway: ScaVerifierGateway,
  ) {}

  async execute(request: ConsumeVerifierCommand): Promise<StrongAuthVerifier> {
    const verifier = await this.verifierRepository.findById(request.verifierId);
    const result = await this.verifierRepository.save(
      new StrongAuthVerifier({
        ...verifier,
        consumedAt: new Date(),
      }),
    );
    return result;
  }
}
