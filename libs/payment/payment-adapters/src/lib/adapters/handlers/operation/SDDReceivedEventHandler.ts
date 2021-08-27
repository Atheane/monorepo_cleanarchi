import { DomainEventHandler } from '@oney/ddd';
import { CreateSDD, CalculateBankAccountExposure } from '@oney/payment-core';
import { SDDReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Logger, SymLogger } from '@oney/logger-core';

@injectable()
export class SDDReceivedEventHandler extends DomainEventHandler<SDDReceived> {
  private readonly handlerName: string;

  constructor(
    @inject(CreateSDD)
    private readonly createSDD: CreateSDD,
    @inject(CalculateBankAccountExposure)
    private readonly synchronizeBankAccountExposure: CalculateBankAccountExposure,
    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props: eventProps }: SDDReceived): Promise<void> {
    this.logger.info(`${this.handlerName}: received event with event properties: ${eventProps}`);
    const { userid: uid } = eventProps;

    this.logger.info(`${this.handlerName}: executing createSdd usecase using parameters :`, eventProps);
    await this.createSDD.execute(eventProps);

    this.logger.info(`${this.handlerName}: executing synchronize exposure usecase for user: ${uid}`);
    await this.synchronizeBankAccountExposure.execute({ uid });
  }
}
