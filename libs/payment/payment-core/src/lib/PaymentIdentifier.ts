export class PaymentIdentifier {
  static readonly networkProvider = Symbol.for('networkProvider');

  static readonly paymentRepositoryWrite = Symbol.for('paymentRepositoryWrite');

  static readonly paymentRepositoryRead = Symbol.for('paymentRepositoryRead');

  static readonly cardRepositoryWrite = Symbol.for('cardRepositoryWrite');

  static readonly cardRepositoryRead = Symbol.for('cardRepositoryRead');

  static readonly transferRepository = Symbol.for('transferRepository');

  static readonly bankAccountGateway = Symbol.for('bankAccountGateway');

  static readonly cardGateway = Symbol.for('cardGateway');

  static readonly operationGateway = Symbol.for('operationGateway');

  static readonly operationRepositoryWrite = Symbol.for('operationRepositoryWrite');

  static readonly bankAccountRepositoryRead = Symbol.for('bankAccountRepositoryRead');

  static readonly bankAccountManagement = Symbol.for('bankAccountManagement');

  static readonly writeService = Symbol.for('writeService');

  static readonly queryService = Symbol.for('queryService');

  static readonly accountManagementWriteService = Symbol.for('accountManagementWriteService');

  static readonly accountManagementQueryService = Symbol.for('accountManagementQueryService');

  static readonly transactionWriteService = Symbol.for('transactionWriteService');

  static readonly transactionQueryService = Symbol.for('transactionQueryService');

  static readonly idGenerator = Symbol.for('idGenerator');

  static readonly storageGateway = Symbol.for('storageGateway');

  static readonly kycGateway = Symbol.for('kycGateway');

  static readonly cacheGateway = Symbol.for('cacheGateway');

  static readonly bankAccountRepositoryWrite = Symbol.for('bankAccountRepositoryWrite');

  static readonly beneficiaryRepositoryRead = Symbol.for('beneficiaryRepositoryRead');

  static readonly bankAccountBalanceGateway = Symbol.for('bankAccountBalanceGateway');

  static readonly callbackPayloadRepository = Symbol.for('callbackPayloadRepository');

  static readonly bankAccountActivationGateway = Symbol.for('bankAccountActivationGateway');

  static readonly notifyUpdateBankAccount = Symbol.for('NotifyUpdateBankAccount');

  static readonly debtGateway = Symbol.for('DebtGateway');

  static readonly updateMonthlyAllowance = Symbol.for('UpdateMonthlyAllowance');

  static readonly getProfileInformationGateway = Symbol.for('getProfileInformationGateway');

  static readonly uncapLimits = Symbol.for('uncapLimits');

  static readonly bankAccountExposureGateway = Symbol.for('bankAccountExposureGateway');
  static readonly featureFlagKycOnCreation = Symbol.for('featureFlagKycOnCreation');

  static readonly creditGateway = Symbol.for('creditGateway');

  static readonly p2pdDebtCollectionConfiguration = Symbol.for('debtCollectionConfiguration');

  static readonly uncappedBalanceLimitConfiguration = Symbol.for('uncappedBalanceLimitConfiguration');

  static readonly globalInConfiguration = Symbol.for('globalInConfiguration');

  static readonly globalOutAnnualAllowanceConfiguration = Symbol.for('globalOutAnnualAllowanceConfiguration');

  static readonly apiErrorReasonMapper = Symbol.for('apiErrorReasonMapper');

  static readonly smoneyCardDisplayPinMapper = Symbol.for('smoneyCardDisplayPinMapper');

  static readonly smoneyCardHmacMapper = Symbol.for('smoneyCardHmacMapper');

  static readonly smoneyCardDisplayDetailsMapper = Symbol.for('smoneyCardDisplayDetailsMapper');
}
