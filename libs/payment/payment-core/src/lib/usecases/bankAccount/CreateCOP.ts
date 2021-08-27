import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { OperationGateway } from '../../domain/gateways/OperationGateway';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Operation } from '../../domain/aggregates/Operation';
import { OperationRepositoryWrite } from '../../domain/repository/operations/OperationRepositoryWrite';

export interface CreateCOPRequest {
  id: string;
  reference: string;
  type: string;
  transactionAmount: string;
  currencyCodeTransaction: string;
  cardHolderBillingAmount?: string;
  cardHolderBillingConversionRate?: string;
  availableBalance: string;
  actionCode?: string;
  merchantType: string;
  cardAcceptorIdentificationCodeName: string;
  status: string;
  userId: string;
}

@injectable()
export class CreateCOP implements Usecase<CreateCOPRequest, Operation> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.operationRepositoryWrite)
    private readonly _operationRepositoryWrite: OperationRepositoryWrite,
    @inject(PaymentIdentifier.operationGateway)
    private readonly _operationGateway: OperationGateway,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(request: CreateCOPRequest): Promise<Operation> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(request.userId);
    const operationProperties = await this._operationGateway.getCOP({
      ...request,
      reference: request.reference,
    });
    const operation = bankAccount.createOperation(operationProperties);

    await this._operationRepositoryWrite.save(operation);
    await this._eventDispatcher.dispatch(operation);

    return operation;
  }
}
