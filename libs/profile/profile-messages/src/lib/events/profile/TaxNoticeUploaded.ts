import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { ProfileDocumentProps } from '../onboarding/types/ProfileDocumentProps';

export interface TaxNoticeUploadedProps {
  document: ProfileDocumentProps;
}

@DecoratedEvent({ version: 1, name: 'TAX_NOTICE_UPLOADED', namespace: '@oney/profile' })
export class TaxNoticeUploaded implements DomainEvent<TaxNoticeUploadedProps> {
  readonly id: string = uuidv4();
  readonly props: TaxNoticeUploadedProps;
  readonly metadata: DomainEventMetadata;

  constructor(props: TaxNoticeUploadedProps) {
    this.props = { ...props };
  }
}
