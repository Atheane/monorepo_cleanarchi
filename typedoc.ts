import * as framework_ddd from './libs/ddd/src';
import * as framework_envs from './libs/common/envs/src';
import * as commonCore from './libs/common/common-core/src';
import * as commonAdapters from './libs/common/common-adapters/src';
import * as identityCore from './libs/identity/identity-core/src';
import * as identityAdapters from './libs/identity/identity-adapters/src';
import * as authenticationCore from './libs/authentication/authentication-core/src/lib';
import * as authenticationAdapters from './libs/authentication/authentication-adapters/src/lib';
import * as authenticationMessages from './libs/authentication/authentication-messages/src';
import * as cdpMessages from './libs/cdp/cdp-messages/src';
import * as cdpCore from './libs/cdp/cdp-core/src';
import * as paymentMessages from './libs/payment/payment-messages/src';
import * as paymentCore from './libs/payment/payment-core/src';
import * as paymentAdapters from './libs/payment/payment-adapters/src';
import * as profileMessages from './libs/profile/profile-messages/src';
import * as profileCore from './libs/profile/profile-core/src';
import * as profileAdapters from './libs/profile/profile-adapters/src';
import * as aggregationCore from './libs/aggregation/aggregation-core/src';
import * as aggregationAdapters from './libs/aggregation/aggregation-adapters/src';
import * as aggregationMessages from './libs/aggregation/aggregation-messages/src';
import * as pfmAdapters from './libs/pfm/pfm-adapters/src';
import * as pfmCore from './libs/pfm/pfm-core/src';
import * as creditCore from './libs/credit/credit-core/src';
import * as creditAdapters from './apps/credit/credit-api/src/core/adapters';
import * as creditMessages from './libs/credit/credit-messages/src';

import * as azServicebusAdapters from './libs/az-servicebus-adapters/src';
import * as rxEventAdapters from './libs/rx-events-adapters/src';
import * as algoanSDK from './libs/algoan/src';
import * as applicationInsights from './libs/applicationinsights-enhanced/src';

export namespace Framework {
  export import ddd = framework_ddd;
  export import envs = framework_envs;
}

export namespace Common {
  export import common_core = commonCore;
  export import common_adapters = commonAdapters;
}

export namespace Identity {
  export import identity_core = identityCore;
  export import identity_adapters = identityAdapters;
}

export namespace Authentication {
  export import authentication_core = authenticationCore;
  export import authentication_adapters = authenticationAdapters;
  export import authentication_messages = authenticationMessages;
}

export namespace Profile {
  export import profile_messages = profileMessages;
  export import profile_core = profileCore;
  export import profile_adapters = profileAdapters;
}

export namespace Payment {
  export import payment_messages = paymentMessages;
  export import payment_core = paymentCore;
  export import payment_adapters = paymentAdapters;
}

export namespace Aggregation {
  export import aggregation_core = aggregationCore;
  export import aggregation_adapters = aggregationAdapters;
  export import aggregation_messages = aggregationMessages;
}

export namespace Cdp {
  export import cdp_core = cdpCore;
  export import cdp_messages = cdpMessages;
}

export namespace Credit {
  export import credit_messages = creditMessages;
  export import credit_adapters = creditAdapters;
  export import credit_core = creditCore;
}

// TODO: TypeDocs doesn't seem to function with export *, must have a single index.ts file in src which exports all the public files like in the other libs
export namespace Pfm {
  export import pfm_core = pfmCore;
  export import pfm_adapters = pfmAdapters;
}

export namespace Others {
  export import az_servicebus_adapters = azServicebusAdapters;
  export import rx_event_adapters = rxEventAdapters;
  export import applicationinsights_enhanced = applicationInsights;
  export import algoan = algoanSDK;
}
