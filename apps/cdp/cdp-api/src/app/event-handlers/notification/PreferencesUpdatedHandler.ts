import { GenericError } from '@oney/common-core';
import { DomainEventHandler } from '@oney/ddd';
import { PreferencesUpdated } from '@oney/notification-messages';
import { injectable } from 'inversify';

@injectable()
export class PreferencesUpdatedHandler extends DomainEventHandler<PreferencesUpdated> {
  public handle(domainEvent: PreferencesUpdated): Promise<void> {
    return;
  }
}
