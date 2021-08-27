import { DomainEventHandler } from '@oney/ddd';
import { BankAccountCreated } from '@oney/payment-messages';
import { injectable } from 'inversify';
import { CreateCreditor } from '../../usecases/creditors';

@injectable()
export class BankAccountCreatedHandler extends DomainEventHandler<BankAccountCreated> {
  private readonly usecase: CreateCreditor;

  constructor(usecase: CreateCreditor) {
    super();
    this.usecase = usecase;
  }

  async handle(domainEvent: BankAccountCreated): Promise<void> {
    const { uid } = domainEvent.props;
    await this.usecase.execute({ userId: uid, isEligible: false });
  }
}
