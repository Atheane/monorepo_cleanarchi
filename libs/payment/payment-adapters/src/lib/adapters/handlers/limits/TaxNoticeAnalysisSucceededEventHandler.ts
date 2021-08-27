import { DomainEventHandler } from '@oney/ddd';
import { TaxNoticeAnalysisSucceeded } from '@oney/profile-messages';
import { injectable } from 'inversify';
import { AskUncapping, AskUncappingCommand, UncappingReason } from '@oney/payment-core';

@injectable()
export class TaxNoticeAnalysisSucceededEventHandler extends DomainEventHandler<TaxNoticeAnalysisSucceeded> {
  constructor(private readonly _askUncapping: AskUncapping) {
    super();
  }

  async handle(domainEvent: TaxNoticeAnalysisSucceeded): Promise<void> {
    const command: AskUncappingCommand = {
      uid: domainEvent.metadata.aggregateId,
      reason: UncappingReason.TAX_STATEMENT,
    };
    await this._askUncapping.execute(command);
  }
}
