import { Env, KeyVault, Load, Local } from '@oney/env';
import { MongoDBConfiguration } from '../domain/config/types/MongoDBConfiguration';
import { ServiceBusConfiguration } from '../domain/config/types/ServiceBusConfiguration';

function isAppRunningInServer() {
  const environments = ['production'];
  const nodeEnv = process.env.NODE_ENV;
  return environments.includes(nodeEnv);
}

const appInfo = {
  name: 'odb_notifications',
  id: '004',
  env: process.env.NODE_ENV,
};

@KeyVault(isAppRunningInServer())
export class Secrets {
  @Env('appInsightsKey')
  readonly apiKey: string;

  @Env('odbNotificationTokenSecret')
  readonly jwtSecret: string;

  @Env('dbProvider')
  readonly mongoURI: string;

  @Env('odbNotificationBusConnectionString')
  readonly busConnectionString;

  @Env('odbNotificationFirebaseKey')
  readonly firebaseKey: string;
}

const secrets = new Secrets();

@Local()
class CorporateBankInfo {
  @Env('CORPORATE_NAME')
  name: string;

  @Env('CORPORATE_ADDRESS_STREET')
  street: string;

  @Env('CORPORATE_ADDRESS_CITY')
  city: string;

  @Env('CORPORATE_ADDRESS_ZIP_CODE')
  zip_code: string;

  @Env('CORPORATE_ADDRESS_COUNTRY')
  country: string;

  @Env('CORPORATE_CUSTOMER_SERVICE')
  customer_service: string;

  @Env('CORPORATE_CAPITAL')
  capital: string;
}

@Local()
class FirebaseConfiguration {
  @Env('ODB_NOTIFICATION_FIREBASE_URL')
  url: string;

  @Env('ODB_NOTIFICATION_FIREBASE_VERSION')
  version: string;

  @Env('ODB_NOTIFICATION_FIREBASE_OPTION')
  option: string;

  @Env('ODB_NOTIFICATION_FIREBASE_ANDROID_FALLBACK')
  androidFallback: string;

  @Env('ODB_NOTIFICATION_FIREBASE_IOS_FALLBACK')
  iosFallback: string;

  @Env('ODB_NOTIFICATION_FIREBASE_ID')
  id: string;

  @Env('ODB_NOTIFICATION_FIREBASE_DOMAIN')
  domain: string;

  key: string = secrets.firebaseKey;
}

@Local()
class AppInsightConfiguration {
  @Env('USE_APP_INSIGHTS')
  readonly isActive: boolean;

  readonly apiKey: string = secrets.apiKey;
}

@Local()
class ServiceBusConfigurationEnv implements ServiceBusConfiguration {
  @Env('ODB_NOTIFICATION_BUS_SUBSCRIPTION')
  subscriptionName: string;

  @Env('ODB_NOTIFICATION_EMAIL_TOPIC')
  emailTopic: string;

  @Env('ODB_NOTIFICATION_SMS_TOPIC')
  smsTopic: string;

  @Env('ODB_NOTIFICATION_PUSH_TOPIC')
  pushTopic: string;

  @Env('ODB_NOTIFICATION_PDF_TOPIC')
  pdfTopic: string;

  @Env('ODB_NOTIFICATION_PREFERENCES_TOPIC')
  preferencesTopic: string;

  @Env('ODB_TRANSACTION_FUNCTIONS_TOPIC')
  transactionFunctionsTopic: string;

  @Env('ODB_PAYMENT_TOPIC')
  odbPaymentTopic: string;

  @Env('ODB_CREDIT_TOPIC')
  odbCreditTopic: string;

  @Env('ODB_AGGREGATION_TOPIC')
  odbAggregationTopic: string;

  @Env('ODB_AUTHENTICATION_TOPIC')
  odbAuthenticationTopic: string;

  @Env('ODB_PROFILE_TOPIC')
  odbProfileTopic: string;

  connectionString: string = secrets.busConnectionString;
}

class MongoDBConfigurationEnv implements MongoDBConfiguration {
  readonly uri: string = secrets.mongoURI;
}

@Local()
export class Configuration {
  @Env('ODB_NOTIFICATION_PORT')
  readonly port: number;

  @Env('ODB_NOTIFICATION_LOG_LEVEL')
  readonly loggerLevel: string;

  @Env('ODB_NOTIFICATION_ACCOUNT_API_URL')
  readonly accountApiUrl: string;

  @Env('ODB_NOTIFICATION_AUTHENTICATION_API_URL')
  readonly authenticationApiUrl: string;

  @Env('ODB_NOTIFICATION_ACCOUNT_MANAGEMENT_API_URL')
  readonly accountManagementApiUrl: string;

  @Env('ODB_FRONT_DOOR_URL')
  readonly frontDoorUrl: string;

  @Env('CUSTOMER_SERVICE_EMAIL')
  readonly customerServiceEmail: string;

  @Env('CUSTOMER_SERVICE_TEMPLATE_PATH')
  readonly customerServiceEmailPath: string;

  @Load(FirebaseConfiguration)
  readonly firebaseConfiguration: FirebaseConfiguration;

  @Load(MongoDBConfigurationEnv)
  readonly mongoDBConfiguration: MongoDBConfigurationEnv;

  @Load(AppInsightConfiguration)
  readonly appInsightConfiguration: AppInsightConfiguration;

  @Load(ServiceBusConfigurationEnv)
  readonly serviceBusConfiguration: ServiceBusConfigurationEnv;

  @Load(CorporateBankInfo)
  readonly corporateBankInfo: CorporateBankInfo;

  @Load(Secrets)
  readonly secrets: Secrets;

  readonly appInfo = appInfo;
}

export const config = new Configuration();
