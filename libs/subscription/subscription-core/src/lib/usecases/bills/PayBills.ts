import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { BillingRepository } from '../../domain/repositories/BillingRepository';
import { PaymentGateway } from '../../domain/gateways/PaymentGateway';

@injectable()
export class PayBills implements Usecase<void, void> {
  constructor(
    @inject(EventProducerDispatcher)
    private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(SubscriptionIdentifier.billingRepository)
    private readonly _billingRepository: BillingRepository,
    @inject(SubscriptionIdentifier.paymentGateway)
    private readonly _paymentGateway: PaymentGateway,
  ) {}

  async execute(): Promise<void> {
    const bills = await this._billingRepository.getDueBills();
    for await (const bill of bills) {
      //Fixme send command for paying bills.
      if (bill.props.amount > 0) {
        await this._paymentGateway.pay(bill);
      }
      bill.pay();
      await this._billingRepository.save(bill);
      await this._eventDispatcher.dispatch(bill);
    }
    return;
  }
}
