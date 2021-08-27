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

export interface AskUncappingCommand {
  uid: string;
  reason: UncappingReason;
}

@injectable()
export class AskUncapping implements Usecase<AskUncappingCommand, BankAccount> {
  constructor(
    @inject(PaymentIdentifier.bankAccountRepositoryRead)
    private readonly _bankAccountRepositoryRead: BankAccountRepositoryRead,
    @inject(PaymentIdentifier.bankAccountRepositoryWrite)
    private readonly _bankAccountRepositoryWrite: BankAccountRepositoryWrite,
    private readonly _eventDispatcher: EventProducerDispatcher,
  ) {}

  async execute(command: AskUncappingCommand): Promise<BankAccount> {
    const bankAccount = await this._bankAccountRepositoryRead.findById(command.uid);
    bankAccount.askUncapping(command.reason);
    await this._bankAccountRepositoryWrite.save(bankAccount);
    await this._eventDispatcher.dispatch(bankAccount);

    return bankAccount;
  }
}
