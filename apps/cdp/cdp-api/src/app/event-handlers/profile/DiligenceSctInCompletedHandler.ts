import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { DiligenceSctInCompleted } from '@oney/profile-messages';
import { injectable } from 'inversify';

@injectable()
export class DiligenceSctInCompletedHandler extends DomainEventHandler<DiligenceSctInCompleted> {
  public handle(domainEvent: DiligenceSctInCompleted): Promise<void> {
    return;
  }
}
