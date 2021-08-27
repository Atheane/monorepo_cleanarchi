const Identifiers = {
  CreatBankUser: Symbol.for('CreatBankUser'),
  AddBankAccountToUser: Symbol.for('AddBankAccountToUser'),
  AddTransactionsToAccount: Symbol.for('AddTransactionsToAccount'),
  FinalizeBankAccountCreation: Symbol.for('FinalizeBankAccountCreation'),
  GetBankUserCreditAnalysis: Symbol.for('GetBankUserCreditAnalysis'),
  AlgoanRepository: Symbol.for('AlgoanRepository'),
  AccountMapper: Symbol.for('AccountMapper'),
  BankUserMapper: Symbol.for('BankUserMapper'),
  TransactionMapper: Symbol.for('TransactionMapper'),
  AlgoanHttpClient: Symbol.for('AlgoanHttpClient'),
  GetAllAccountsTransactionsOfUser: Symbol.for('GetAllAccountsTransactionsOfUser'),
  ScoringMapper: Symbol.for('ScoringMapper'),
  LongPolling: Symbol.for('LongPolling'),
};

export { Identifiers };
