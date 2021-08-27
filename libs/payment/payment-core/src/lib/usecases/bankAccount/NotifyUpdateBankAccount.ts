import { Usecase } from '@oney/ddd';
import { EventProducerDispatcher } from '@oney/messages-core';
import { inject, injectable } from 'inversify';
import { BankAccount } from '../../domain/aggregates/BankAccount';

@injectable()
export class NotifyUpdateBankAccount implements Usecase<BankAccount, BankAccount> {
  constructor(@inject(EventProducerDispatcher) private readonly _eventDispatcher: EventProducerDispatcher) {}

  async execute(bankAccount: BankAccount): Promise<BankAccount> {
    await this._eventDispatcher.dispatch(bankAccount);
    return bankAccount;
  }
}
