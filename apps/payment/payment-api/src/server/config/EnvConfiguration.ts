import { Env, Local, Load, KeyVault } from '@oney/envs';
import { Configuration, SmoneyConf, KvConfiguration, BankAccountConf } from '@oney/payment-adapters';

const isProduction = process.env.NODE_ENV === 'production';

@KeyVault(isProduction)
export class BankAccountConfiguration implements BankAccountConf {
  @Env('bankCreditAccount')
  bankCreditAccount: string;

  @Env('bankAutoBalanceAccount')
  bankAutoBalanceAccount: string;

  @Env('coverAccount')
  coverAccount: string;

  @Env('bankBillingAccount')
  bankBillingAccount: string;

  @Env('bankLossAccount')
  bankLossAccount: string;
}

@KeyVault(isProduction)
export class SmoneyConfiguration implements SmoneyConf {
  @Env('smoneyBic')
  smoneyBic: string;

  @Env('smoneyStsConnectUrl')
  getTokenUrl: string;

  @Env('smoneyStsClientId')
  clientId: string;

  @Env('smoneyStsClientSecret')
  clientSecret: string;

  @Env('smoneyStsGrantType')
  grantType: string;

  @Env('smoneyStsScope')
  scope: string;

  @Env('SmoneyApiBaseUrl')
  baseUrl: string;

  @Env('SmoneyApiToken')
  legacyToken: string;
}

@KeyVault(isProduction)
export class KeyVaultConfiguration implements KvConfiguration {
  @Env('cosmosDbConnectionString')
  mongoPath: string;

  @Load(SmoneyConfiguration)
  smoneyConfiguration: SmoneyConf;

  @Env('appInsightKey')
  appInsightKey: string;

  @Env('serviceBusConnectionString')
  serviceBusUrl: string;

  @Env('azureBlobConnectionString')
  azureBlobConnectionString: string;

  @Load(BankAccountConfiguration)
  bankAccountConfiguration: BankAccountConfiguration;

  @Env('odbPaymentAuthKey')
  paymentAuthKey: string;

  @Env('jwtSecret')
  jwtSecret: string;
}

@Local()
export class EnvConfiguration implements Configuration {
  @Env('ODB_PAYMENT_MONGO_ACCOUNT_MANAGEMENT_COLLECTION')
  accountManagementMongoDbCollection: string;

  @Env('ODB_PAYMENT_MONGO_TRANSACTIONS_COLLECTION')
  transactionsMongoDbCollection: string;

  @Env('ODB_PAYMENT_MONGO_ACCOUNT_MANAGEMENT_DATABASE')
  accountManagementMongoDbDatabase: string;

  @Env('ODB_PAYMENT_MONGO_TRANSACTIONS_DATABASE')
  transactionsMongoDbDatabase: string;

  @Env('USE_APP_INSIGHTS')
  useAppInsight: boolean;

  @Env('ODB_PAYMENT_MANAGEMENT_BUS_SUBSCRIPTION')
  serviceBusSub: string;

  @Env('ODB_PAYMENT_TOPIC')
  serviceBusTopic: string;

  @Env('ODB_CDP_TOPIC')
  cdpTopic: string;

  @Env('AZURE_BLOB_CONTAINER')
  azureBlobContainerName: string;

  @Env('TOPIC_ODB_PROFILE_AZF')
  topicOdbProfileAzf: string;

  @Env('MAX_ATM_WEEKLY_ALLOWANCE_CLASSIC_VISA')
  maxAtmWeeklyAllowanceVisaClassic: number;

  @Env('MAX_MONTHLY_ALLOWANCE_CLASSIC_VISA')
  maxMonthlyAllowanceVisaClassic: number;

  @Env('MAX_ATM_WEEKLY_ALLOWANCE_PREMIER_VISA')
  maxAtmWeeklyAllowanceVisaPremier: number;

  @Env('MAX_MONTHLY_ALLOWANCE_PREMIER_VISA')
  maxMonthlyAllowanceVisaPremier: number;

  @Env('CARD_LIFECYCLE_FUNCTION_TOPIC')
  serviceBusCardLifecycleFunctionTopic: string;

  @Env('TOPIC_ODB_PROFILE')
  odbProfileTopic: string;

  @Env('TOPIC_ODB_CREDIT')
  odbCreditTopic: string;

  @Env('FRONT_DOOR_BASE_URL')
  frontDoorApiBaseUrl: string;

  @Env('ODB_TRANSACTION_FUNCTIONS_TOPIC')
  topicTransaction: string;

  @Env('SMONEY_EKYC_FUNCTION_SERVICE_BUS_TOPIC')
  ekycFunctionTopic: string;

  @Env('GLOBAL_IN_ANNUAL_ALLOWANCE')
  globalInAnnualAllowance: number;

  @Env('GLOBAL_IN_MONTHLY_ALLOWANCE')
  globalInMonthlyAllowance: number;

  @Env('GLOBAL_IN_WEEKLY_ALLOWANCE')
  globalInWeeklyAllowance: number;

  @Env('GLOBAL_OUT_ANNUAL_ALLOWANCE')
  globalOutAnnualAllowance: number;

  @Env('BALANCE_LIMIT')
  balanceLimit: number;

  @Env('ODB_SUBSCRIPTION_TOPIC')
  subscriptionTopic: string;

  @Env('FEATURE_FLAG_KYC_ON_CREATION')
  featureFlagKycOnCreation: boolean;

  @Env('UNCAPPED_BALANCE_LIMIT')
  uncappedBalanceLimit: number;

  @Env('P2P_DEBT_COLLECTION_BENEFICIARY')
  p2pDebtCollectBeneficiary: string;

  @Env('SMONEY_CHANNEL_CODE')
  channelCode: string;
}

export const envConfiguration = EnvConfiguration.prototype;
export const keyVaultConfiguration = KeyVaultConfiguration.prototype;
