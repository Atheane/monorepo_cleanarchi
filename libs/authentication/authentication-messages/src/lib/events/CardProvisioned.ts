import { v4 as uuidv4 } from 'uuid';
import { DomainEvent, DomainEventMetadata } from '@oney/ddd';
import { DecoratedEvent } from '@oney/messages-core';
import { ProvisioningEventName } from '../types/ProvisioningEventName';
import { Domain } from '../types/Domain';
import { Provisioning } from '../types/Provisioning';
import { HashedCardPan } from '../types/HashedCardPan';

export interface CardProvisionedProperties {
  hashedCardPan: HashedCardPan;
  cardProvisioning: Provisioning;
}

@DecoratedEvent({
  version: 1,
  name: ProvisioningEventName.CARD_PROVISIONED,
  namespace: Domain.AUTHENTICATION,
})
export class CardProvisioned implements DomainEvent<CardProvisionedProperties> {
  id: string = uuidv4();
  metadata?: DomainEventMetadata;
  props: CardProvisionedProperties;

  constructor(props: CardProvisionedProperties) {
    this.props = props;
  }
}
