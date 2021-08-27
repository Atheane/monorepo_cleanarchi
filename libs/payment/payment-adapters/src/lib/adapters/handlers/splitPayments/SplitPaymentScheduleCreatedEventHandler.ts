import { SplitPaymentScheduleCreated } from '@oney/credit-messages';
import { DomainEventHandler } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import { UpdateTechnicalLimit, UpdateTechnicalLimitCommand } from '@oney/payment-core';
import { inject, injectable } from 'inversify';

@injectable()
export class SplitPaymentScheduleCreatedEventHandler extends DomainEventHandler<SplitPaymentScheduleCreated> {
  private readonly handlerName: string;
  constructor(
    @inject(UpdateTechnicalLimit)
    private readonly updateTechnicalLimit: UpdateTechnicalLimit,
    @inject(SymLogger) private readonly logger: Logger,
  ) {
    super();
    this.handlerName = this.constructor.name;
  }

  async handle({ props }: SplitPaymentScheduleCreated): Promise<void> {
    const handlerName = SplitPaymentScheduleCreatedEventHandler.name;
    this.logger.info(`${handlerName}: received event for uid: ${props.userId}, ${JSON.stringify(props)}`);

    const FIRST_MONTH_PAYMENT_KEY = '001';
    const FEES_PAYMENT_KEY = 'fee';

    const { userId } = props;
    const funding = props.fundingExecution.amount;
    const fees = props.paymentsExecution.find(payment => payment.key === FEES_PAYMENT_KEY).amount;
    const firstPayment = props.paymentsExecution.find(payment => payment.key === FIRST_MONTH_PAYMENT_KEY)
      .amount;

    const command: UpdateTechnicalLimitCommand = {
      uid: userId,
      useContract: true,
      contract: {
        fees,
        firstPayment,
        funding: funding,
      },
    };
    this.logger.info('Executing UpdateTechnicalLimit usecase');
    await this.updateTechnicalLimit.execute(command);
  }
}
