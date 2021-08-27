import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import {
  BankAccount,
  BankAccountRepositoryRead,
  BankAccountRepositoryWrite,
  UncappingReason,
} from '@oney/payment-core';
import { EventProducerDispatcher } from '@oney/messages-core';
import { PaymentIdentifier } from '../../PaymentIdentifier';

export interface RejectUncappingCommand {
  uid: string;
  reason: UncappingReason;
}

@injectable()
export class RejectUncapping implements Usecase<RejectUncappingCommand, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(command: RejectUncappingCommand): Promise<BankAccount> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(command.uid);
    bankAccount.rejectUncapping(command.reason);
    await this._bankAccountRepositoryWrite.save(bankAccount);
    await this._eventDispatcher.dispatch(bankAccount);

    return bankAccount;
  }
}
