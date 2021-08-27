import { Bill, PaymentGateway } from '@oney/subscription-core';
import { injectable } from 'inversify';
import { ApiProvider } from '@oney/common-core';
import { ServiceApi } from '@oney/common-adapters';

@injectable()
export class OdbPaymentGateway implements PaymentGateway {
  constructor(private readonly _apiProvider: ApiProvider<ServiceApi>) {}

  async pay(bill: Bill): Promise<void> {
    return await this._apiProvider.api().payment.createPayment({
      amount: bill.props.amount,
      message: '',
      orderId: bill.props.orderId,
      recurency: null,
      ref: bill.props.ref,
      senderId: bill.props.uid,
    });
  }
}
