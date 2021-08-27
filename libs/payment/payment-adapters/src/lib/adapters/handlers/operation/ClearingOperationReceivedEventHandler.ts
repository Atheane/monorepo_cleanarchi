import { DomainEventHandler } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { CalculateBankAccountExposure, CreateClearing } from '@oney/payment-core';
import { ClearingOperationReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';

@injectable()
export class ClearingOperationReceivedEventHandler extends DomainEventHandler<ClearingOperationReceived> {
  private readonly handlerName: string;

  constructor(
    @inject(CreateClearing)
    private readonly createClearing: CreateClearing,
    @inject(CalculateBankAccountExposure)
    private readonly synchronizeBankAccountExposure: CalculateBankAccountExposure,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props: eventProps }: ClearingOperationReceived): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties: `, eventProps);

    this.logger.info(`${this.handlerName}: executing createClearing usecase using parameters :`, eventProps);
    const operation = await this.createClearing.execute(eventProps);
    const uid = operation.props.uid;

    this.logger.info(`${this.handlerName}: executing synchronize exposure usecase for user: ${uid}`);
    await this.synchronizeBankAccountExposure.execute({ uid });
  }
}
