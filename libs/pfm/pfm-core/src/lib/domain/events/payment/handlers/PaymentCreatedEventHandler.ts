import { DomainEventHandler } from '@oney/ddd';
import { PaymentCreated } from '@oney/payment-messages';
import { injectable } from 'inversify';
import { CreateP2p } from '../../../../usecases/p2p/CreateP2p';

@injectable()
export class PaymentCreatedEventHandler extends DomainEventHandler<PaymentCreated> {
  private readonly usecase: CreateP2p;

  constructor(usecase: CreateP2p) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: PaymentCreated): Promise<void> {
    await this.usecase.execute({
      p2pCreated: {
        ...domainEvent.props,
        sender: { ...domainEvent.props.sender, fullname: domainEvent.props.sender.fullName },
        beneficiary: { ...domainEvent.props.beneficiary, fullname: domainEvent.props.beneficiary.fullName },
        date: domainEvent.props.executionDate,
      },
    });
  }
}
