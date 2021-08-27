import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { v4 } from 'uuid';
import { DecoratedEvent } from '@oney/messages-core';
import { BankAccountInformation, CreditCardInformation, ProfileInformation } from '../..';

export interface CreateMembershipCommand {
  subscriptionId: string;
  profileInfo: ProfileInformation;
  bankAccountInfo: BankAccountInformation;
  creditCardInfo: CreditCardInformation;
}

@DecoratedEvent({ version: 1, name: 'CREATE_MEMBERSHIP_COMMAND', namespace: '@oney/subscription' })
export class CreateMembership implements DomainEvent<CreateMembershipCommand> {
  metadata: DomainEventMetadata;
  props: CreateMembershipCommand;
  id = v4();

  constructor(props: CreateMembershipCommand) {
    this.props = props;
  }
}
