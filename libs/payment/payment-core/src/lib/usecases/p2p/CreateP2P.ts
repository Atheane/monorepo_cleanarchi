import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { OrderId } from '@oney/common-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Transfer } from '../../domain/aggregates/Transfer';
import { BankAccountManagement } from '../../domain/gateways/BankAccountManagement';
import { PaymentRepositoryWrite } from '../../domain/repository/payment/PaymentRepositoryWrite';
import { TagRepositoryRead } from '../../domain/repository/payment/TagRepositoryRead';
import { TransferFrequencyType } from '../../domain/types/TransferFrequencyType';
import { CounterParty } from '../../domain/valueobjects/CounterParty';
import { Recurrency } from '../../domain/valueobjects/Recurrency';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';
import { PaymentError } from '../../models/errors/PaymentErrors';

export class CreateP2PRequest {
  ref: number;

  amount: number;

  recurency: {
    endRecurrency: Date;
    frequencyType: TransferFrequencyType;
  };

  senderId: string;

  beneficiaryId?: string;

  message: string;

  contractNumber?: string;

  orderId?: string;
}

@injectable()
export class CreateP2P implements Usecase<CreateP2PRequest, Transfer> {
  constructor(
    @inject(PaymentIdentifier.paymentRepositoryRead)
    private readonly paymentRepositoryRead: TagRepositoryRead,
    @inject(PaymentIdentifier.paymentRepositoryWrite)
    private readonly paymentRepositoryWrite: PaymentRepositoryWrite,
    @inject(PaymentIdentifier.bankAccountManagement)
    private readonly bankAccountManagement: BankAccountManagement,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(PaymentIdentifier.bankAccountGateway) private readonly _bankAccountGateway: BankAccountGateway,
  ) {}

  async execute(request: CreateP2PRequest): Promise<Transfer> {
    const tag = await this.paymentRepositoryRead.getByRef(request.ref, request.contractNumber);
    let beneficiary: string;
    const orderId = request.orderId || new OrderId(6, 5).value;
    const sender = await this.bankAccountManagement.handle(tag.senderType, request.senderId);

    if (tag.isBeneficiaryTypeAndSenderTypeAUserAccount()) {
      if (request.beneficiaryId) {
        beneficiary = request.beneficiaryId;
      } else {
        throw new PaymentError.MissingBeneficiaryId('MISSING_BENEFICIARYID');
      }
    } else {
      beneficiary = await this.bankAccountManagement.handle(tag.beneficiaryType, request.senderId);
    }

    const beneficiaryBankAccount = await this._bankAccountGateway.getBankAccount(beneficiary);
    const senderBankAccount = await this._bankAccountGateway.getBankAccount(sender);
    const payment = Transfer.createP2P({
      amount: request.amount,
      beneficiary: new CounterParty({
        id: beneficiaryBankAccount.props.bankAccountId,
        uid: beneficiaryBankAccount.props.uid,
      }),
      message: request.message,
      tag,
      orderId: orderId,
      recurrence: !request.recurency
        ? null
        : new Recurrency({
            ...request.recurency,
          }),
      sender: new CounterParty({
        id: senderBankAccount.props.bankAccountId,
        uid: senderBankAccount.props.uid,
      }),
      executionDate: new Date(),
    });
    const processPayment = await this.paymentRepositoryWrite.create(sender, beneficiary, payment);
    await this._eventDispatcher.dispatch(payment);
    return processPayment;
  }
}
