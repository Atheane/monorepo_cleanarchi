import { ThirdPartyAuthFinished } from '@oney/aggregation-messages';
import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { injectable } from 'inversify';

@injectable()
export class ThirdPartyAuthFinishedHandler extends DomainEventHandler<ThirdPartyAuthFinished> {
  public handle(domainEvent: ThirdPartyAuthFinished): Promise<void> {
    return;
  }
}
