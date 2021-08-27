import { inject, injectable } from 'inversify';
import { IdentityIdentifier } from '../IdentityIdentifier';
import { Identity } from '../domain/entities/Identity';
import { ConsumeScaGateway } from '../domain/gateways/ConsumeScaGateway';
import { VerifyScaGateway } from '../domain/gateways/VerifyScaGateway';
import { Usecase } from '../domain/models/Usecase';
import { Action } from '../domain/types/ScaVerifier';

export interface VerifyScaRequest {
  action: Action;
  identity: Identity;
}

@injectable()
export class VerifySca implements Usecase<VerifyScaRequest, boolean> {
  constructor(
    @inject(IdentityIdentifier.verifyScaGateway) private readonly _verifyScaGateway: VerifyScaGateway,
    @inject(IdentityIdentifier.consumeScaGateway) private readonly _consumeScaGateway: ConsumeScaGateway,
  ) {}

  async execute(request: VerifyScaRequest): Promise<boolean> {
    const scaVerifier = await this._verifyScaGateway.verify({
      identity: request.identity,
      request: request.action,
    });
    if (scaVerifier.valid) {
      await this._consumeScaGateway.consume(request.identity);
    }
    return scaVerifier.valid;
  }
}
