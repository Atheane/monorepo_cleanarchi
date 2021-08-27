import { Usecase } from '@oney/ddd';
import { EventDispatcher } from '@oney/messages-core';
import { ClearingOperationReceived } from '@oney/payment-messages';
import { inject, injectable } from 'inversify';
import { OperationGateway } from '../../domain/gateways/OperationGateway';
import { PaymentIdentifier } from '../../PaymentIdentifier';

export interface ExtractClearingBatchRequest {
  reference: string;
}

@injectable()
export class ExtractClearingBatch implements Usecase<ExtractClearingBatchRequest, void> {
  constructor(
    @inject(PaymentIdentifier.operationGateway)
    private readonly _operationGateway: OperationGateway,
    @inject(EventDispatcher) private readonly eventDispatcher: EventDispatcher,
  ) {}

  async execute(request: ExtractClearingBatchRequest): Promise<void> {
    const clearings = await this._operationGateway.getClearings(request.reference);
    await Promise.all(
      clearings.map(clearing => this.eventDispatcher.dispatch(new ClearingOperationReceived(clearing))),
    );
  }
}
