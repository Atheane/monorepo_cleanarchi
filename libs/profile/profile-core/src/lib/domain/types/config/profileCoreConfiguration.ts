import { ProvidersConfig } from './providersConfig';
import { DbConfig } from './dbConfig';

export interface ProfileCoreConfiguration {
  mongoUrl?: string;
  mongoCollection?: string;
  otpDbConfig?: DbConfig;
  providersConfig: ProvidersConfig;
  inMemoryMode: boolean;
  forceAzureServiceBus?: boolean;
  serviceBusUrl: string;
  serviceBusSub: string;
  serviceBusTopic: string;
  serviceBusProfileAzfTopic: string;
  topicPaymentAzfEkyc: string;
  topicOdbAggregation: string;
  otpExpirationTime: number;
  otpMaxAttempts: number;
  otpLockDuration: number;
  activateGenericOtp: boolean;
  odbProfileBlobStorageCs: string;
  blobStorageContainerName: string;
  customerServiceTopicsVersion: string;
  odbPaymentTopic: string;
  odbContractPath: string;
  odbCdpTopic: string;
  featureFlag: {
    profileStatusSaga: boolean;
  };
  frontDoorApiBaseUrl: string;
  documentGeneratorApiUrl: string;
}
