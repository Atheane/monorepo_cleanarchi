import { DomainEventHandler } from '@oney/ddd';
import { ProfileActivated, ProfileStatus } from '@oney/profile-messages';
import { inject } from 'inversify';
import { ApplyLocalLimits, ApplyLocalLimitsCommand } from '@oney/payment-core';
import { Logger, SymLogger } from '@oney/logger-core';

export class ProfileActivatedEventHandler extends DomainEventHandler<ProfileActivated> {
  private readonly handlerName: string;
  constructor(
    @inject(ApplyLocalLimits) private readonly _applyLocalLimits: ApplyLocalLimits,
    @inject(SymLogger)
    private readonly _logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle(domainEvent: ProfileActivated): Promise<void> {
    this._logger.info(`${this.handlerName}: received event with event properties: `, domainEvent.props);

    if (domainEvent.props.profileStatus === ProfileStatus.ACTIVE) {
      const command: ApplyLocalLimitsCommand = {
        uid: domainEvent.metadata.aggregateId,
      };
      await this._applyLocalLimits.execute(command);
    }
  }
}
