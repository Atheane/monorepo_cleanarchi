import { DomainEventHandler } from '@oney/ddd';
import { defaultLogger } from '@oney/logger-adapters';
import { CustomerServiceDemandSent } from '@oney/profile-messages';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../../di/Identifiers';
import { SendCustomerServiceNotification } from '../../usecase/profile/SendCustomerServiceNotification';

@injectable()
export class CustomerServiceDemandSentHandler extends DomainEventHandler<CustomerServiceDemandSent> {
  constructor(
    @inject(Identifiers.SendCustomerServiceNotification)
    private sendCustomerServiceNotification: SendCustomerServiceNotification,
  ) {
    super();
  }

  async handle(event: CustomerServiceDemandSent): Promise<void> {
    defaultLogger.info(`Received CUSTOMER_SERVICE_DEMAND_SENT event`, event);
    await this.sendCustomerServiceNotification.execute(event.props);
  }
}
