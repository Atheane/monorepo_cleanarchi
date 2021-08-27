import { AuthIdentifier, ProvisionUserPhone } from '@oney/authentication-core';
import { DomainEventHandler } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { PhoneStepValidated } from '@oney/profile-messages';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class PhoneStepValidatedEventHandler extends DomainEventHandler<PhoneStepValidated> {
  constructor(
    @inject(ProvisionUserPhone) private readonly _provisionUserPhone: ProvisionUserPhone,
    @inject(AuthIdentifier.useIcgSmsAuthFactor) private readonly _useIcgSmsAuthFactor: boolean,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: PhoneStepValidated): Promise<void> {
    this._logger.info(
      `Received message in phone step validated handler with payload ${JSON.stringify(domainEvent.props)}`,
    );
    this._logger.info(`Sms auth factor set to: ${this._useIcgSmsAuthFactor}`);
    const user = await this._provisionUserPhone.execute({
      userId: domainEvent.metadata.aggregateId,
      phone: domainEvent.props.phone,
      useIcgSmsAuthFactor: this._useIcgSmsAuthFactor,
    });
    this._logger.info(`[${user.props.uid}] User after phone provisioning: ${user}`);
  }
}
