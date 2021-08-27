import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { KycDiligenceFailed } from '@oney/payment-messages';
import { injectable } from 'inversify';

@injectable()
export class KycDiligenceFailedHandler extends DomainEventHandler<KycDiligenceFailed> {
  public handle(domainEvent: KycDiligenceFailed): Promise<void> {
    return;
  }
}
