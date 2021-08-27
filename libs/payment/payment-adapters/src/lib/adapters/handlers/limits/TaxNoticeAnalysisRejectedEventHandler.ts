import { DomainEventHandler } from '@oney/ddd';
import { TaxNoticeAnalysisRejected } from '@oney/profile-messages';
import { injectable } from 'inversify';
import { RejectUncapping, RejectUncappingCommand, UncappingReason } from '@oney/payment-core';

@injectable()
export class TaxNoticeAnalysisRejectedEventHandler extends DomainEventHandler<TaxNoticeAnalysisRejected> {
  constructor(private readonly _rejectUncapping: RejectUncapping) {
    super();
  }

  async handle(domainEvent: TaxNoticeAnalysisRejected): Promise<void> {
    const command: RejectUncappingCommand = {
      uid: domainEvent.metadata.aggregateId,
      reason: UncappingReason.TAX_STATEMENT,
    };
    await this._rejectUncapping.execute(command);
  }
}
