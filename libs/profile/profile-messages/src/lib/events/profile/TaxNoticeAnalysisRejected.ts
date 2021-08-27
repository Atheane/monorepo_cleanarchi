import { DecoratedEvent } from '@oney/messages-core';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 as uuidv4 } from 'uuid';

@DecoratedEvent({ version: 1, name: 'TAX_NOTICE_ANALYSIS_REJECTED', namespace: '@oney/profile' })
export class TaxNoticeAnalysisRejected implements DomainEvent {
  id: string = uuidv4();
  props: object;
  metadata: DomainEventMetadata;

  constructor(props: object, metadata?: DomainEventMetadata) {
    this.props = { ...props };
    this.metadata = { ...metadata };
  }
}
