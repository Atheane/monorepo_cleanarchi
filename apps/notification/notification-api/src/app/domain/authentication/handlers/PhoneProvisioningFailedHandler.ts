import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { DomainEventHandler } from '@oney/ddd';
import { PhoneProvisioningFailed } from '@oney/authentication-messages';
import { SendProvisioningErrorNotification } from '../../../usecase/authentication/SendProvisioningErrorNotification';
import { Identifiers } from '../../../di/Identifiers';

@injectable()
export class ProvisioningErrorHandler extends DomainEventHandler<PhoneProvisioningFailed> {
  constructor(
    @inject(Identifiers.SendProvisioningErrorNotification)
    private readonly _sendFailedProvisioningNotification: SendProvisioningErrorNotification,
  ) {
    super();
  }

  async handle(domainEvent: PhoneProvisioningFailed): Promise<void> {
    defaultLogger.info(
      `Received ${domainEvent.metadata.eventName} event with payload ${JSON.stringify(domainEvent.props)}`,
    );
    await this._sendFailedProvisioningNotification.execute(domainEvent.props);
  }
}
