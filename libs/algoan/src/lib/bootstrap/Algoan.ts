import 'reflect-metadata';
import { Container } from 'inversify';
import { AlgoanConfig } from './AlgoanConfig';
import { AlgoanHttpClient } from './AlgoanHttpClient';
import { Identifiers } from './Identifiers';
import { LongPolling } from '../adapters/infra/network/LongPolling';
import { AccountMapper } from '../adapters/mapper/AccountMapper';
import { BankUserMapper } from '../adapters/mapper/BankUserMapper';
import { TransactionMapper } from '../adapters/mapper/TransactionMapper';
import { AlgoanRestRepository } from '../adapters/repository/AlgoanRestRepository';
import { AlgoanRepository } from '../domain/port/AlgoanRepository';
import { AddBankAccountToUser } from '../usecases/AddBankAccountToUser';
import { AddTransactionsToAccount } from '../usecases/AddTransactionsToAccount';
import { CreatBankUser } from '../usecases/CreatBankUser';
import { FinalizeBankAccountCreation } from '../usecases/FinalizeBankAccountCreation';
import { GetAllAccountsTransactionsOfUser } from '../usecases/GetAllAccountsTransactionsOfUser';
import { GetBankUserCreditAnalysis } from '../usecases/GetBankUserCreditAnalysis';

export class Algoan extends Container {
  initDependencies(algoanConfig: AlgoanConfig) {
    this.bind<CreatBankUser>(Identifiers.CreatBankUser).to(CreatBankUser);
    this.bind<AddBankAccountToUser>(Identifiers.AddBankAccountToUser).to(AddBankAccountToUser);
    this.bind<AddTransactionsToAccount>(Identifiers.AddTransactionsToAccount).to(AddTransactionsToAccount);
    this.bind<GetBankUserCreditAnalysis>(Identifiers.GetBankUserCreditAnalysis).to(GetBankUserCreditAnalysis);
    this.bind<FinalizeBankAccountCreation>(Identifiers.FinalizeBankAccountCreation).to(
      FinalizeBankAccountCreation,
    );
    this.bind<AlgoanRepository>(Identifiers.AlgoanRepository).to(AlgoanRestRepository);
    this.bind<AccountMapper>(Identifiers.AccountMapper).to(AccountMapper);
    this.bind<BankUserMapper>(Identifiers.BankUserMapper).to(BankUserMapper);
    this.bind<TransactionMapper>(Identifiers.TransactionMapper).to(TransactionMapper);
    this.bind<LongPolling>(Identifiers.LongPolling).toConstantValue(
      new LongPolling(algoanConfig.longPolling),
    );
    const algoanHttpClient = new AlgoanHttpClient(algoanConfig);
    this.bind<AlgoanHttpClient>(Identifiers.AlgoanHttpClient).toConstantValue(algoanHttpClient);
    this.bind<GetAllAccountsTransactionsOfUser>(Identifiers.GetAllAccountsTransactionsOfUser).to(
      GetAllAccountsTransactionsOfUser,
    );
  }

  public getUseCases() {
    return {
      creatBankUser: this.get<CreatBankUser>(Identifiers.CreatBankUser),
      addBankAccountToUser: this.get<AddBankAccountToUser>(Identifiers.AddBankAccountToUser),
      addTransactionsToAccount: this.get<AddTransactionsToAccount>(Identifiers.AddTransactionsToAccount),
      finalizeBankAccountCreation: this.get<FinalizeBankAccountCreation>(
        Identifiers.FinalizeBankAccountCreation,
      ),
      getAllAccountsTransactions: this.get<GetAllAccountsTransactionsOfUser>(
        Identifiers.GetAllAccountsTransactionsOfUser,
      ),
      getBankUserCreditAnalysis: this.get<GetBankUserCreditAnalysis>(Identifiers.GetBankUserCreditAnalysis),
    };
  }
}
