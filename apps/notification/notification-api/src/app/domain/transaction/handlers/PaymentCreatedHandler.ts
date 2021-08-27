import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { Events } from '@oney/notification-messages';
import { PaymentCreated } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';
import { CounterParty } from '../types';

@injectable()
export class PaymentCreatedHandler extends DomainEventHandler<PaymentCreated> {
  private readonly refreshClient: RefreshClient;

  constructor(@inject(Identifiers.RefreshClient) refreshClient: RefreshClient) {
    super();
    this.refreshClient = refreshClient;
  }

  async handle(domainEvent: PaymentCreated): Promise<void> {
    const { sender, beneficiary } = domainEvent.props;
    defaultLogger.info(
      `Received PAYMENT_CREATED event for sender ${sender.uid}, beneficiary ${beneficiary.uid}`,
    );
    await this.notify(sender, domainEvent);
    await this.notify(beneficiary, domainEvent);
  }

  private async notify(counterParty: CounterParty, domainEvent: PaymentCreated) {
    if (!counterParty.uid) {
      return;
    }

    const refreshClientCommand: RefreshClientCommand = {
      userId: counterParty.uid,
      eventName: Events.PAYMENT_CREATED,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };

    await this.refreshClient.execute(refreshClientCommand);
  }
}
