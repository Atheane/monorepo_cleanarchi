import { DomainEventHandler } from '@oney/ddd';
import { SituationAttached } from '@oney/profile-messages';
import { UpdateCustomerType } from '@oney/subscription-core';
import { CustomerType } from '@oney/subscription-messages';
import { injectable } from 'inversify';

@injectable()
export class CustomerTypeHandler extends DomainEventHandler<SituationAttached> {
  constructor(private readonly updateCustomerType: UpdateCustomerType) {
    super();
  }

  async handle(domainEvent: SituationAttached): Promise<void> {
    await this.updateCustomerType.execute({
      uid: domainEvent.metadata.aggregateId,
      customerType: this.toCustomerType(domainEvent),
    });
    return;
  }

  private toCustomerType(domainEvent: SituationAttached): CustomerType {
    const {
      props: { vip, staff, lead },
    } = domainEvent;
    if (vip) {
      return CustomerType.VIP;
    }
    if (staff) {
      return CustomerType.COLLABORATOR;
    }
    if (lead) {
      return CustomerType.LEAD;
    }
    return CustomerType.DEFAULT;
  }
}
