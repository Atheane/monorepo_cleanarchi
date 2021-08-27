import { Usecase } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { inject, injectable } from 'inversify';
import { PingIcgError } from '../../domain/models/AuthenticationError';
import { AuthIdentifier } from '../AuthIdentifier';
import { ScaVerifierGateway } from '../../domain/gateways/ScaVerifierGateway';

@injectable()
export class PingAuth implements Usecase<void, boolean> {
  constructor(
    @inject(AuthIdentifier.verifierService) private readonly verifierGateway: ScaVerifierGateway,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {}

  async execute(): Promise<boolean> {
    // user id must end with "@NEWTEST" to be considered healthcheck user by authentication partner
    const healthcheckUserId = 'health_auth_user@NEWTEST';

    // initialize authentication
    const verifier = await this.verifierGateway.generateVerifier(healthcheckUserId);

    this._logger.info(`Healthcheck verifer: ${JSON.stringify(verifier)}`);

    // make verify request
    const credential = '0'.repeat(8);
    const updatedVerifier = await this.verifierGateway.verify(verifier, credential);

    this._logger.info(`Healthcheck updated verifer: ${JSON.stringify(updatedVerifier)}`);

    if (updatedVerifier.valid && updatedVerifier.status === 'DONE') {
      return true;
    }

    throw new PingIcgError.IcgPingFailed('ICG_AUTH_PING_HAS_FAILED', {
      message: `ICG auth is ${false}`,
      name: 'ICG_AUTH_HEALTH_ERROR',
    });
  }
}
