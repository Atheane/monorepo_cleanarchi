import { DomainEventHandler } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { GetFicpFcc } from '@oney/profile-core';
import { PreEligibilityOK } from '@oney/cdp-messages';
import { inject, injectable } from 'inversify';

@injectable()
export class PreEligibilityOKEventHandler extends DomainEventHandler<PreEligibilityOK> {
  constructor(private readonly _getFicpFcc: GetFicpFcc, @inject(SymLogger) private readonly _logger: Logger) {
    super();
  }

  async handle(domainEvent: PreEligibilityOK): Promise<void> {
    this._logger.info(`handling PreEligibilityOK event`, domainEvent);
    await this._getFicpFcc.execute({
      uid: domainEvent.props.uId,
    });
  }
}
