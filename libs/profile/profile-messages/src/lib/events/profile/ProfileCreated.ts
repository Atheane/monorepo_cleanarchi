import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { v4 as uuidv4 } from 'uuid';
import { OnboardingSteps } from '../types/OnboardingSteps';
import { ProfileStatus } from '../../..';

export interface ProfileCreatedProps {
  uid: string;
  email: string;
  steps: OnboardingSteps[];
  digitalIdentityId: string;
  status: ProfileStatus;
  phone?: string;
}

@DecoratedEvent({ name: 'PROFILE_CREATED', version: 1, namespace: '@oney/profile' })
export class ProfileCreated implements DomainEvent<ProfileCreatedProps> {
  id = uuidv4();
  props: ProfileCreatedProps;
  metadata: DomainEventMetadata;

  constructor(props: ProfileCreatedProps) {
    this.props = props;
  }
}
