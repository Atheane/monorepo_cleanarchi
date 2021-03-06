export const PfmIdentifiers = {
  fileStorage: Symbol.for('fileStorage'),
  bankAccountsService: Symbol.for('bankAccountsService'),
  transactionsService: Symbol.for('transactionsService'),
  accountStatementService: Symbol.for('accountStatementService'),
  mappers: {
    accountStatementMapper: Symbol.for('accountStatementMapper'),
    bankAccountAggregationMapper: Symbol.for('bankAccountAggregationMapper'),
    bankAccountSMoneyMapper: Symbol.for('bankAccountSMoneyMapper'),
    transactionBudgetInsightMapper: Symbol.for('transactionBudgetInsightMapper'),
    transactionSMoneyMapper: Symbol.for('transactionSMoneyMapper'),
    transactionSMoneyP2pMapper: Symbol.for('transactionSMoneyP2pMapper'),
    p2pMongoMapper: Symbol.for('P2pMongoMapper'),
    bankAccountMapper: Symbol.for('BankAccountMapper'),
    transactionMapper: Symbol.for('TransactionMapper'),
    userMapper: Symbol.for('UserMapper'),
  },
  aggregationBankAccountRepository: Symbol.for('aggregationBankAccountRepository'),
  smoneyBankAccountRepository: Symbol.for('smoneyBankAccountRepository'),
  bankAccountRepository: Symbol.for('bankAccountRepository'),
  budgetInsightTransactionRepository: Symbol.for('budgetInsightTransactionRepository'),
  smoneyTransactionRepository: Symbol.for('smoneyTransactionRepository'),
  accountStatementRepository: Symbol.for('accountStatementRepository'),
  getOneAccountStatement: Symbol.for('getOneAccountStatement'),
  processStatements: Symbol.for('processStatements'),
  processMonthlyStatements: Symbol.for('processMonthlyStatements'),
  p2pRepository: Symbol.for('p2pRepository'),
  operationRepository: Symbol.for('operationRepository'),
  userRepository: Symbol.for('userRepository'),
  idGenerator: Symbol.for('idGenerator'),
  configuration: Symbol.for('configuration'),
  serviceApiProvider: Symbol.for('serviceApiProvider'),
  busDelivery: Symbol.for('busDelivery'),
};
