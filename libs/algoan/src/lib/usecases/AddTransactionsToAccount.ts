import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { AddTransactionsCommand } from './types/AddTransactionsCommand';
import { Identifiers } from '../bootstrap/Identifiers';
import { Transaction } from '../domain/models/Transaction';
import { AlgoanRepository } from '../domain/port/AlgoanRepository';

@injectable()
export class AddTransactionsToAccount implements Usecase<AddTransactionsCommand, Transaction[]> {
  constructor(
    @inject(Identifiers.AlgoanRepository)
    private readonly _algoanRepository: AlgoanRepository,
  ) {}

  async execute(addTransactionsCommand: AddTransactionsCommand): Promise<Transaction[]> {
    const { transactions, accountId, bankUserId } = addTransactionsCommand;
    return await this._algoanRepository.addTransactions(transactions, accountId, bankUserId);
  }
}
