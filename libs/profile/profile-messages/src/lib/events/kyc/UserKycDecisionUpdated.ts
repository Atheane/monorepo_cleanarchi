import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { KycDecisionType } from './types/KycDecisionType';
import { ProfileStatus } from '../types/ProfileStatus';
import { DocumentSide, DocumentType } from '../onboarding/types/ProfileDocumentProps';

export interface KycDecisionDocument {
  type: DocumentType;
  side?: DocumentSide;
  location?: string;
}

export interface UserKycDecisionUpdatedProps {
  kyc: {
    decision: KycDecisionType;
    politicallyExposed: KycDecisionType;
    sanctioned: KycDecisionType;
  };
  informations: {
    status: ProfileStatus | string;
  };
  documents: KycDecisionDocument[];
}

@DecoratedEvent({ version: 1, name: 'USER_KYC_DECISION_UPDATED', namespace: '@oney/profile' })
export class UserKycDecisionUpdated implements DomainEvent<UserKycDecisionUpdatedProps> {
  id: string = uuidv4();

  props: UserKycDecisionUpdatedProps;

  metadata?: DomainEventMetadata;

  constructor(props: UserKycDecisionUpdatedProps) {
    this.props = { ...props };
  }
}
