import { DomainEventHandler } from '@oney/ddd';
import { DocumentAdded, DocumentType } from '@oney/profile-messages';
import { AskUncapping, AskUncappingCommand, UncappingReason } from '@oney/payment-core';
import { injectable } from 'inversify';

@injectable()
export class TaxNoticeUploadedEventHandler extends DomainEventHandler<DocumentAdded> {
  constructor(private readonly _askUncapping: AskUncapping) {
    super();
  }

  async handle(domainEvent: DocumentAdded): Promise<void> {
    if (domainEvent.props.type === DocumentType.TAX_NOTICE) {
      const command: AskUncappingCommand = {
        uid: domainEvent.props.uid,
        reason: UncappingReason.TAX_STATEMENT,
      };
      await this._askUncapping.execute(command);
    }
  }
}
