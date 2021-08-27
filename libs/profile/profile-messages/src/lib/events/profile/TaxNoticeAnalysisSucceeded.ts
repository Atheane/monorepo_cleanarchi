import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';

export interface TaxNoticeAnalysisProps {
  globalGrossIncome: string;
  personalSituationCode: string;
}

@DecoratedEvent({ version: 1, name: 'TAX_NOTICE_ANALYSIS_SUCCEEDED', namespace: '@oney/profile' })
export class TaxNoticeAnalysisSucceeded implements DomainEvent<TaxNoticeAnalysisProps> {
  id: string = uuidv4();
  props: TaxNoticeAnalysisProps;
  metadata?: DomainEventMetadata;

  constructor(props: TaxNoticeAnalysisProps, metadata?: DomainEventMetadata) {
    this.props = { ...props };
    this.metadata = { ...metadata };
  }
}
