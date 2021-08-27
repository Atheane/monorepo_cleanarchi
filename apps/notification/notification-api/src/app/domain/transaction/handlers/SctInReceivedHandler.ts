import { inject } from 'inversify';
import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { Events, SctInReceived } from '@oney/payment-messages';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

export class SctInReceivedHandler extends DomainEventHandler<SctInReceived> {
  constructor(@inject(Identifiers.RefreshClient) private refreshClient: RefreshClient) {
    super();
  }

  async handle(domainEvent: SctInReceived): Promise<void> {
    const { userid } = domainEvent.props.callback;

    defaultLogger.info(`Received SCT_IN_RECEIVED event for user ${userid}`);

    const refreshClientCommand: RefreshClientCommand = {
      userId: userid,
      eventName: Events.SCT_IN_RECEIVED,
      eventDate: new Date(),
      eventPayload: JSON.stringify(domainEvent),
    };

    await this.refreshClient.execute(refreshClientCommand);
  }
}
