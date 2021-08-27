import { DomainEventHandler } from '@oney/ddd';
import { SymLogger, Logger } from '@oney/logger-core';
import { CollectDebt, OrderDebtsCollectionCommand } from '@oney/payment-core';
import { DebtsCollectionOrdered } from '@oney/payment-messages';
import { inject } from 'inversify';

export class DebtsCollectionOrderedHandler extends DomainEventHandler<DebtsCollectionOrdered> {
  constructor(
    @inject(CollectDebt)
    private collectDebt: CollectDebt,

    @inject(SymLogger)
    private readonly logger: Logger,
  ) {
    super();
  }

  async handle({ props: eventProps }: DebtsCollectionOrdered): Promise<void> {
    const { amount, uid } = eventProps;
    this.logger.info(`${DebtsCollectionOrderedHandler.name} uid: ${uid} received amount :${amount}`);

    this.logger.info(`uid: ${uid} executing collectDebt usecase`);
    const refreshClientCommand: OrderDebtsCollectionCommand = { uid, amount };
    await this.collectDebt.execute(refreshClientCommand);
  }
}
