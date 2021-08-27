import 'reflect-metadata';
import { AzureFunction, Context } from '@azure/functions';
import { ConfigService } from '@oney/env';
import { CdpEventName } from '@oney/cdp-messages';
import { CdpKernel } from './src/config/di/CdpKernel';
import { getAppConfiguration, IAzfConfiguration } from './src/config/envs';
import { ValidCdpEventName } from './src/core/domain/valueobjects';
import { ICdpEligibilityPayload } from './src/core/domain/types/ICdpEligibilityPayload';
import {
  DispatchAccountEligibility,
  DispatchAggregatedAccountsIncomes,
  DispatchCustomBalanceLimit,
  DispatchPreEligibility,
  DispatchX3X4Eligibility,
} from './src/core/usecases';

const eventHubTrigger: AzureFunction = async function (
  context: Context,
  payload: ICdpEligibilityPayload,
): Promise<void> {
  try {
    await new ConfigService({
      localUri: null,
      keyvaultUri: process.env.AUTH_KEY_VAULT_URI,
    }).loadEnv();

    const config: IAzfConfiguration = getAppConfiguration();
    const kernel = new CdpKernel(config).initDependencies();

    const payloadWithValidEventName = new ValidCdpEventName(payload).value;

    if (payloadWithValidEventName.title === CdpEventName.X3X4_ELIGIBILITY_CALCULATED) {
      await kernel.get(DispatchX3X4Eligibility).execute(payloadWithValidEventName);
    } else if (payloadWithValidEventName.title === CdpEventName.ACCOUNT_ELIGIBILITY_CALCULATED) {
      await kernel.get(DispatchAccountEligibility).execute(payloadWithValidEventName);
    } else if (payloadWithValidEventName.title === CdpEventName.PRE_ELIGIBILITY_OK) {
      await kernel.get(DispatchPreEligibility).execute(payloadWithValidEventName);
    } else if (payloadWithValidEventName.title === CdpEventName.CUSTOM_BALANCE_LIMIT_CALCULATED) {
      await kernel.get(DispatchCustomBalanceLimit).execute(payloadWithValidEventName);
    } else if (payloadWithValidEventName.title === CdpEventName.AGGREGATED_ACCOUNTS_INCOMES_CHECKED) {
      await kernel.get(DispatchAggregatedAccountsIncomes).execute(payloadWithValidEventName);
    }
  } catch (e) {
    context.log(e);
  }
};

export default eventHubTrigger;
