import { DomainEventHandler } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { ExtractClearingBatch } from '@oney/payment-core';
import { ClearingBatchReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';

@injectable()
export class ClearingBatchReceivedEventHandler extends DomainEventHandler<ClearingBatchReceived> {
  private readonly handlerName: string;

  constructor(
    @inject(ExtractClearingBatch)
    private readonly extractClearingBatch: ExtractClearingBatch,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props: eventProps }: ClearingBatchReceived): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties: `, eventProps);
    const { reference } = eventProps;

    this.logger.info(
      `${this.handlerName}: executing extractClearingBatch usecase using parameters :`,
      eventProps,
    );
    await this.extractClearingBatch.execute({ reference });
  }
}
