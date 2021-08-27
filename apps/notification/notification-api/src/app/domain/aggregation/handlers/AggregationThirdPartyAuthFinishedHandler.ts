import { DomainEventHandler } from '@oney/ddd';
import { ThirdPartyAuthFinished, AggregationEvents } from '@oney/aggregation-messages';
import { defaultLogger } from '@oney/logger-adapters';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../../di/Identifiers';
import { RefreshClient, RefreshClientCommand } from '../../../usecase/RefreshClient';

@injectable()
export class AggregationThirdPartyAuthFinishedHandler extends DomainEventHandler<ThirdPartyAuthFinished> {
  private readonly usecase: RefreshClient;

  constructor(@inject(Identifiers.RefreshClient) usecase: RefreshClient) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: ThirdPartyAuthFinished): Promise<void> {
    const { state, userId } = domainEvent.props;
    defaultLogger.info(
      `Received ${AggregationEvents.THIRD_PARTY_AUTH_FINISHED} for connectionId ${domainEvent.metadata.aggregateId}, userId ${userId} with state ${state}`,
    );
    const refreshClientCommand: RefreshClientCommand = {
      userId,
      eventName: AggregationEvents.THIRD_PARTY_AUTH_FINISHED,
      eventDate: new Date(),
      eventPayload: JSON.stringify({
        state,
        connectionId: domainEvent.metadata.aggregateId,
      }),
    };
    await this.usecase.execute(refreshClientCommand);
  }
}
