import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { OrderId } from '@oney/common-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { PaymentIdentifier } from '../../PaymentIdentifier';
import { Transfer } from '../../domain/aggregates/Transfer';
import { BankAccountRepositoryRead } from '../../domain/repository/bankAccounts/BankAccountRepositoryRead';
import { PaymentRepositoryWrite } from '../../domain/repository/payment/PaymentRepositoryWrite';
import { TagRepositoryRead } from '../../domain/repository/payment/TagRepositoryRead';
import { TransferRepositoryWrite } from '../../domain/repository/transfer/TransferRepositoryWrite';
import { TransferFrequencyType } from '../../domain/types/TransferFrequencyType';
import { CounterParty } from '../../domain/valueobjects/CounterParty';
import { Recurrency } from '../../domain/valueobjects/Recurrency';
import { GetProfileInformationGateway } from '../../domain/gateways/GetProfileInformationGateway';
import { BankAccountGateway } from '../../domain/gateways/BankAccountGateway';
import { BeneficiaryError } from '../../models/errors/PaymentErrors';

export class MakeTransferRequest {
  amount: number;

  recurrency: {
    endRecurrency: Date;
    frequencyType: TransferFrequencyType;
  };

  userId: string;

  beneficiaryId?: string;

  message: string;

  executionDate: Date;

  reason?: string;

  recipientEmail?: string;
}

@injectable()
export class MakeTransfer implements Usecase<MakeTransferRequest, Transfer> {
  constructor(
    @inject(PaymentIdentifier.transferRepository)
    private readonly transferRepositoryWrite: TransferRepositoryWrite,
    @inject(PaymentIdentifier.paymentRepositoryRead) private readonly tagRepositoryRead: TagRepositoryRead,
    @inject(PaymentIdentifier.paymentRepositoryWrite)
    private readonly paymentRepositoryWrite: PaymentRepositoryWrite,
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher,
    @inject(PaymentIdentifier.getProfileInformationGateway)
    private readonly _getProfileInformationGateway: GetProfileInformationGateway,
    @inject(PaymentIdentifier.bankAccountGateway) private readonly bankAccountGateway: BankAccountGateway,
  ) {}

  async execute(request: MakeTransferRequest): Promise<Transfer> {
    const transferRequest = {
      amount: request.amount,
      message: request.message,
      orderId: new OrderId(6, 5).value,
      recurrence: request.recurrency ? new Recurrency(request.recurrency) : null,
      executionDate: request.executionDate || new Date(),
      recipientEmail: request.recipientEmail,
    };

    const senderProfile = await this._getProfileInformationGateway.getById(request.userId);
    const senderBankAccount = await this._bankAccountRepositoryRead.findById(request.userId);
    const beneficiary = senderBankAccount.props.beneficiaries.find(
      item => item.props.id === request.beneficiaryId,
    );

    if (!beneficiary) {
      throw new BeneficiaryError.BeneficiaryNotFound(
        `Beneficiary with id ${request.beneficiaryId} not found.`,
      );
    }

    const oneyBeneficiaryIban = await this.bankAccountGateway.isOneyBankAccount(
      request.userId,
      request.beneficiaryId,
    );
    if (oneyBeneficiaryIban) {
      const beneficiaryBankAccount = await this._bankAccountRepositoryRead.findByIban(oneyBeneficiaryIban);
      const tag = await this.tagRepositoryRead.getByRef(36);
      const processP2P = Transfer.createP2P({
        ...transferRequest,
        tag,
        executionDate: new Date(),
        sender: new CounterParty({
          id: senderBankAccount.props.bankAccountId,
          uid: senderBankAccount.props.uid,
          iban: senderBankAccount.props.iban,
          fullName: `${senderProfile.informations.firstName} ${senderProfile.informations.birthName}`,
        }),
        beneficiary: new CounterParty({
          id: beneficiaryBankAccount.props.bankAccountId,
          uid: beneficiaryBankAccount.props.uid,
          iban: beneficiaryBankAccount.props.iban,
          fullName: beneficiary.props.name,
        }),
      });

      const paymentCreated = await this.paymentRepositoryWrite.create(
        senderBankAccount.props.uid,
        beneficiaryBankAccount.props.uid,
        processP2P,
      );
      await this._eventDispatcher.dispatch(processP2P);
      return paymentCreated;
    }

    const transfer = Transfer.makeTransfer({
      ...transferRequest,
      sender: new CounterParty({
        id: senderBankAccount.props.bankAccountId,
        uid: senderBankAccount.props.uid,
        iban: senderBankAccount.props.iban,
        fullName: `${senderProfile.informations.firstName} ${senderProfile.informations.birthName}`,
      }),
      beneficiary: new CounterParty({
        id: beneficiary.props.id,
        iban: beneficiary.props.iban,
        fullName: beneficiary.props.name,
      }),
      tag: null,
    });
    const transferCreated = await this.transferRepositoryWrite.create(
      senderBankAccount.props.uid,
      transfer,
      request.reason,
    );
    await this._eventDispatcher.dispatch(transfer);
    return transferCreated;
  }
}
