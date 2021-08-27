import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { SubscriptionIdentifier } from '../../SubscriptionIdentifier';
import { Bill } from '../../domain/aggregates/Bill';
import { BillingRepository } from '../../domain/repositories/BillingRepository';

export interface GetBillBySubscriptionIdRequest {
  subscriptionId: string;
}

@injectable()
export class GetBillBySubscriptionId implements Usecase<GetBillBySubscriptionIdRequest, Bill[]> {
  constructor(
    @inject(SubscriptionIdentifier.billingRepository)
    private readonly _billingRepository: BillingRepository,
  ) {}

  async execute(request: GetBillBySubscriptionIdRequest): Promise<Bill[]> {
    return await this._billingRepository.getBySubscriptionId(request.subscriptionId);
  }
}
