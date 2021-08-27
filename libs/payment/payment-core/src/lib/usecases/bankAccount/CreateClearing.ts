import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { OperationGateway } from '../../domain/gateways/OperationGateway';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Operation } from '../../domain/aggregates/Operation';
import { OperationRepositoryWrite } from '../../domain/repository/operations/OperationRepositoryWrite';

export interface CreateClearingRequest {
  reference: string;
  originalAmount: number;
  amount: number;
  financialNetworkCode: number;
  exchangeRate: number;
  currency: string;
  status: number;
  type: number;
  cardId: string;
  merchant: {
    street: string;
    city: string;
    categoryCode: number;
    name: string;
  };
}

@injectable()
export class CreateClearing implements Usecase<CreateClearingRequest, Operation> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.operationRepositoryWrite)
    private readonly _operationRepositoryWrite: OperationRepositoryWrite,
    @inject(PaymentIdentifier.operationGateway)
    private readonly _operationGateway: OperationGateway,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateClearingRequest): Promise<Operation> {
    const operationProperties = await this._operationGateway.getSingleClearing(request);
    const bankAccount = await this._bankAccountRepositoryRead.findById(operationProperties.uid);
    const operation = bankAccount.createOperation(operationProperties);

    await this._operationRepositoryWrite.save(operation);
    await this._eventDispatcher.dispatch(operation);

    return operation;
  }
}
