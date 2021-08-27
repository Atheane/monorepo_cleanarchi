import { PaymentIdentifier, Operation, OperationRepositoryWrite, WriteService } from '@oney/payment-core';
import { inject, injectable } from 'inversify';
import { OperationDbModel } from '../../../mongodb/models/OperationDbModel';

@injectable()
export class OdbOperationRepositoryWrite implements OperationRepositoryWrite {
  constructor(
    @inject(PaymentIdentifier.transactionWriteService) private readonly _writeService: WriteService,
  ) {}

  async save(operation: Operation): Promise<Operation> {
    await this._writeService.upsert<OperationDbModel>({ orderId: operation.props.orderId }, operation.props);
    return operation;
  }
}
