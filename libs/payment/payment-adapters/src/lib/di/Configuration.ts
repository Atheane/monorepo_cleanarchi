export interface SmoneyConf {
  smoneyBic: string;
  getTokenUrl: string;
  clientId: string;
  clientSecret: string;
  grantType: string;
  scope: string;
  baseUrl: string;
  legacyToken: string;
}

export interface BankAccountConf {
  bankCreditAccount;
  bankAutoBalanceAccount;
  coverAccount;
  bankBillingAccount;
  bankLossAccount;
}

export interface KvConfiguration {
  mongoPath: string;
  smoneyConfiguration: SmoneyConf;
  appInsightKey: string;
  serviceBusUrl: string;
  azureBlobConnectionString: string;
  bankAccountConfiguration: BankAccountConf;
  paymentAuthKey: string;
  jwtSecret: string;
}

export interface Configuration {
  accountManagementMongoDbCollection: string;
  transactionsMongoDbCollection: string;
  accountManagementMongoDbDatabase: string;
  transactionsMongoDbDatabase: string;
  useAppInsight: boolean;
  serviceBusSub: string;
  serviceBusTopic: string;
  azureBlobContainerName: string;
  topicOdbProfileAzf: string;
  topicTransaction: string;
  maxAtmWeeklyAllowanceVisaClassic: number;
  maxMonthlyAllowanceVisaClassic: number;
  maxAtmWeeklyAllowanceVisaPremier: number;
  maxMonthlyAllowanceVisaPremier: number;
  serviceBusCardLifecycleFunctionTopic: string;
  cdpTopic: string;
  odbProfileTopic: string;
  odbCreditTopic: string;
  frontDoorApiBaseUrl: string;
  ekycFunctionTopic: string;
  globalInAnnualAllowance: number;
  globalInMonthlyAllowance: number;
  globalInWeeklyAllowance: number;
  globalOutAnnualAllowance: number;
  balanceLimit: number;
  subscriptionTopic: string;
  featureFlagKycOnCreation: boolean;
  uncappedBalanceLimit: number;
  p2pDebtCollectBeneficiary: string;
  channelCode: string;
}
