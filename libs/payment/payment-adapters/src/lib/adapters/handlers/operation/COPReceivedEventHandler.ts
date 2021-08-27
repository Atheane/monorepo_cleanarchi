import { DomainEventHandler } from '@oney/ddd';
import { CreateCOP, CalculateBankAccountExposure } from '@oney/payment-core';
import { COPReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class COPReceivedEventHandler extends DomainEventHandler<COPReceived> {
  private readonly handlerName: string;

  constructor(
    @inject(CreateCOP)
    private readonly createCOP: CreateCOP,
    @inject(CalculateBankAccountExposure)
    private readonly synchronizeBankAccountExposure: CalculateBankAccountExposure,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props: eventProps }: COPReceived): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties: `, eventProps);
    const { userId: uid } = eventProps;

    this.logger.info(`${this.handlerName}: executing createCop usecase using parameters :`, eventProps);
    await this.createCOP.execute(eventProps);

    this.logger.info(`${this.handlerName}: executing synchronize exposure usecase for user: ${uid}`);
    await this.synchronizeBankAccountExposure.execute({ uid });
  }
}
