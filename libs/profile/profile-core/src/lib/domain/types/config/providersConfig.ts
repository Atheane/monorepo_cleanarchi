import { CdpConfig } from './cdpConfig';
import { OneytrustConfig } from './oneytrustConfig';
import { OneyB2CConfig } from './oneyB2CConfig';
import { OdbPaymentConfig } from './odbPaymentConfig';
import { OneyFccFicpConfig } from './OneyFccFicpConfig';

export interface ProvidersConfig {
  cdpConfig: CdpConfig;
  oneytrustConfig: OneytrustConfig;
  oneyB2CConfig: OneyB2CConfig;
  odbPaymentConfig: OdbPaymentConfig;
  oneyFccFicp: OneyFccFicpConfig;
}
