import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { KycDiligenceSucceeded } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class KycDiligenceSucceededHandler extends DomainEventHandler<KycDiligenceSucceeded> {
  public handle(domainEvent: KycDiligenceSucceeded): Promise<void> {
    return;
  }
}
