import { DomainEventHandler } from '@oney/ddd';
import { Logger, SymLogger } from '@oney/logger-core';
import {
  CalculateBankAccountExposure,
  OrderDebtsCollection,
  OrderDebtsCollectionCommand,
} from '@oney/payment-core';
import { SctInReceived } from '@oney/payment-messages';
import { inject } from 'inversify';
import { SmoneyCurrencyUnitMapper } from '../../mappers/SmoneyCurrencyUnitMapper';

export class SctInReceivedHandler extends DomainEventHandler<SctInReceived> {
  constructor(
    @inject(OrderDebtsCollection)
    private orderDebtCollection: OrderDebtsCollection,
    @inject(CalculateBankAccountExposure)
    private readonly calculateBankAccountExposure: CalculateBankAccountExposure,
    @inject(SmoneyCurrencyUnitMapper)
    private smoneyCurrencyUnitMapper: SmoneyCurrencyUnitMapper,
    @inject(SymLogger) private readonly logger: Logger,
  ) {
    super();
  }

  async handle({ props: eventProps }: SctInReceived): Promise<void> {
    this.logger.info(`handler triggered by event SctInReceived, eventProps: ${eventProps}`);

    const { userid } = eventProps.callback;
    const { Amount } = eventProps.details;
    const amountInEuros = this.smoneyCurrencyUnitMapper.toDomain(Amount);

    const refreshClientCommand: OrderDebtsCollectionCommand = {
      uid: userid,
      amount: amountInEuros,
    };

    await this.orderDebtCollection.execute(refreshClientCommand);

    this.logger.info(
      `${SctInReceivedHandler.name}: executing calculateBankAccountExposure usecase for user: ${userid}`,
    );
    await this.calculateBankAccountExposure.execute({ uid: userid });
  }
}
