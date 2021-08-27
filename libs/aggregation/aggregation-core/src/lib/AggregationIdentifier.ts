export class AggregationIdentifier {
  static bankRepository = Symbol.for('bankRepository');
  static bankAccountRepository = Symbol.for('bankAccountRepository');
  static userRepository = Symbol.for('userRepository');
  static bankConnectionRepository = Symbol.for('bankConnectionRepository');
  static transactionRepository = Symbol.for('transactionRepository');
  static biBankAccountRepository = Symbol.for('biBankAccountRepository');
  static userGateway = Symbol.for('userGateway');
  static bankConnectionGateway = Symbol.for('bankConnectionGateway');
  static bankAccountGateway = Symbol.for('bankAccountGateway');
  static scaConnectionGateway = Symbol.for('scaConnectionGateway');
  static biCrendentialGateway = Symbol.for('biCrendentialGateway');
  static creditGateway = Symbol.for('creditGateway');
  static hydrateBankAccountService = Symbol.for('hydrateBankAccountService');
  static creditDecisioningService = Symbol.for('creditDecisioningService');
  static idGenerator = Symbol.for('IdGenerator');
  static busDelivery = Symbol.for('BusDelivery');
  static bankMapper = Symbol.for('bankMapper');
  static bankAccountMapper = Symbol.for('bankAccountMapper');
  static bankConnectionMapper = Symbol.for('bankConnectionMapper');
  static connectionStateMapper = Symbol.for('connectionStateMapper');
  static connectionMapper = Symbol.for('connectionMapper');
  static budgetInsightTransactionMapper = Symbol.for('budgetInsightTransactionMapper');
  static ownerIdentityMapper = Symbol.for('ownerIdentityMapper');
  static algoanBankAccountMapper = Symbol.for('algoanBankAccountMapper');
  static budgetInsightBankAccountTypeMapper = Symbol.for('budgetInsightBankAccountTypeMapper');
  static algoanBankAccountTypeMapper = Symbol.for('algoanBankAccountTypeMapper');
  static algoanTransactionMapper = Symbol.for('algoanTransactionMapper');
  static algoanTransactionTypeMapper = Symbol.for('algoanTransactionTypeMapper');
  static creditProfileMapper = Symbol.for('creditProfileMapper');
  static algoanCategorizedTransactionMapper = Symbol.for('algoanCategorizedTransactionMapper');
  static algoanCategorizedTransactionAggregateMapper = Symbol.for(
    'algoanCategorizedTransactionAggregateMapper',
  );
  static mongoDbBankAccountMapper = Symbol.for('mongoDbBankAccountMapper');
  static deleteUser = Symbol.for('deleteUser');
  static appConfiguration = Symbol.for('appConfiguration');
  static fileStorageService = Symbol.for('fileStorageService');
  static serviceApiProvider = Symbol.for('serviceApiProvider');
  static longPolling = Symbol.for('longPolling');
  static aggregationPartnerRepository = Symbol.for('aggregationPartnerRepository');
  static bankAccountService = Symbol.for('bankAccountService');
  static biBankAccountService = Symbol.for('biBankAccountService');
}
