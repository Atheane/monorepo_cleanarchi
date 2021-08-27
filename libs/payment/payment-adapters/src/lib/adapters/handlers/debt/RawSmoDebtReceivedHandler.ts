import { DomainEventHandler } from '@oney/ddd';
import { SyncAccountDebts } from '@oney/payment-core';
import { RawSmoDebtReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class RawSmoDebtReceivedHandler extends DomainEventHandler<RawSmoDebtReceived> {
  private readonly handlerName: string;

  constructor(
    @inject(SyncAccountDebts)
    private readonly _syncAccountDebts: SyncAccountDebts,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props }: RawSmoDebtReceived): Promise<any> {
    this.logger.info(`${this.handlerName}: received event with event properties:`, props);
    const { userId } = props;

    this.logger.info(`${this.handlerName}: executing synchronize exposure usecase for user: ${userId}`);
    return this._syncAccountDebts.execute(userId);
  }
}
