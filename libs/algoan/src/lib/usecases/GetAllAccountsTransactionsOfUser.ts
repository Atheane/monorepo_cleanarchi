import { Usecase } from '@oney/ddd';
import { inject, injectable } from 'inversify';
import { Identifiers } from '../bootstrap/Identifiers';
import { AlgoanTransactionsNotFound } from '../domain/models/AlgoanTransactionsNotFound';
import { CategorizedTransaction } from '../domain/models/CategorizedTransaction';
import { AlgoanRepository } from '../domain/port/AlgoanRepository';

@injectable()
export class GetAllAccountsTransactionsOfUser implements Usecase<string, CategorizedTransaction[]> {
  constructor(
    @inject(Identifiers.AlgoanRepository)
    private readonly _algoanRepository: AlgoanRepository,
  ) {}

  async execute(bankUserId: string): Promise<CategorizedTransaction[]> {
    const allAccounts = await this._algoanRepository.getAllAccounts(bankUserId);
    const result: CategorizedTransaction[] = [];
    const allPromises = allAccounts.map(async account => {
      const transactions = await this._algoanRepository.getAllAccountTransactions(
        bankUserId,
        account.id,
        account.reference,
      );
      if (transactions.length > 0) {
        const categorizedTransaction = {
          id: account.reference,
          refId: account.id,
          transactions: transactions,
        };
        result.push(categorizedTransaction);
      }
    });
    await Promise.all(allPromises);
    if (result.length === 0) throw new AlgoanTransactionsNotFound();
    return result;
  }
}
