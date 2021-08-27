import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { TransferCreated } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { SendTransferNotification } from '../../../usecase/payment/SendTransferNotification';

@injectable()
export class PaymentTransferCreatedHandler extends DomainEventHandler<TransferCreated> {
  constructor(
    @inject(Identifiers.SendTransferNotification) private sendTransferNotification: SendTransferNotification,
  ) {
    super();
  }

  async handle(domainEvent: TransferCreated): Promise<void> {
    defaultLogger.info(`Received TRANSFER_CREATED event`, domainEvent);
    await this.sendTransferNotification.execute(domainEvent.props);
  }
}
