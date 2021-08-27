import { DomainEventHandler } from '@oney/ddd';
import { LcbFtUpdated } from '@oney/payment-messages';
import { UpdateProfileLcbFt } from '@oney/profile-core';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

//Fixme : not covered by test.
@injectable()
export class LcbFtUpdatedEventHandler extends DomainEventHandler<LcbFtUpdated> {
  constructor(
    private readonly _updateProfileLcbFt: UpdateProfileLcbFt,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: LcbFtUpdated): Promise<void> {
    this._logger.info(`handling LcbFtUpdated event`, domainEvent);
    await this._updateProfileLcbFt.execute(domainEvent.props);
  }
}
