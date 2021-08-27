import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { OperationGateway } from '../../domain/gateways/OperationGateway';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Operation } from '../../domain/aggregates/Operation';
import { OperationRepositoryWrite } from '../../domain/repository/operations/OperationRepositoryWrite';

export interface CreateSDDRequest {
  id: string;
  reference: string;
  type: string;
  status: string;
  userid: string;
}

@injectable()
export class CreateSDD implements Usecase<CreateSDDRequest, Operation> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.operationRepositoryWrite)
    private readonly _operationRepositoryWrite: OperationRepositoryWrite,
    @inject(PaymentIdentifier.operationGateway)
    private readonly _operationGateway: OperationGateway,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateSDDRequest): Promise<Operation> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.userid);
    const operationProperties = await this._operationGateway.getSDD(request.reference);
    const operation = bankAccount.createOperation(operationProperties);

    await this._operationRepositoryWrite.save(operation);
    await this._eventDispatcher.dispatch(operation);

    return operation;
  }
}
