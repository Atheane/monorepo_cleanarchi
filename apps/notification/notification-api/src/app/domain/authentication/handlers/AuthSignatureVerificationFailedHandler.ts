import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { DomainEventHandler } from '@oney/ddd';
import { AuthSignatureVerificationFailed } from '@oney/authentication-messages';
import { SendAuthSignatureVerificationErrorNotification } from '../../../usecase/authentication/SendAuthSignatureVerificationErrorNotification';
import { Identifiers } from '../../../di/Identifiers';

@injectable()
export class AuthSignatureVerificationFailedHandler extends DomainEventHandler<
  AuthSignatureVerificationFailed
> {
  constructor(
    @inject(Identifiers.SendAuthSignatureVerificationErrorNotification)
    private readonly _sendAuthSignatureVerificationErrorNotification: SendAuthSignatureVerificationErrorNotification,
  ) {
    super();
  }

  async handle(domainEvent: AuthSignatureVerificationFailed): Promise<void> {
    defaultLogger.info(
      `Received ${domainEvent.metadata.eventName} event with payload ${JSON.stringify(domainEvent.props)}`,
    );
    await this._sendAuthSignatureVerificationErrorNotification.execute(domainEvent.props);
  }
}
