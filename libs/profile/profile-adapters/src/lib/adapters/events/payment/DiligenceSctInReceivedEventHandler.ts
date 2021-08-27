import { DomainEventHandler } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { DiligenceSctInReceived } from '@oney/payment-messages';
import { CompleteDiligence } from '@oney/profile-core';
import { inject, injectable } from 'inversify';

//Fixme : not covered by test.
@injectable()
export class DiligenceSctInReceivedEventHandler extends DomainEventHandler<DiligenceSctInReceived> {
  constructor(
    private readonly _completeDiligence: CompleteDiligence,
    @inject(SymLogger) private readonly _logger: Logger,
  ) {
    super();
  }

  async handle(domainEvent: DiligenceSctInReceived): Promise<void> {
    /* istanbul ignore else */
    this._logger.info(`handling DiligenceSctInReceived event`, domainEvent);
    await this._completeDiligence.execute(domainEvent.props);
  }
}
