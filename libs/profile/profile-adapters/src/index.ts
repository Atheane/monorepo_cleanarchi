/**
 * @packageDocumentation
 * @module profile-adapters
 */

export { buildProfileAdapterLib, configureServiceProvider } from './lib/adapters/build';
export { BankAccountAggregatedEventHandler } from './lib/adapters/events/aggregation/BankAccountAggregatedEventHandler';
export { BankAccountOpenedEventHandler } from './lib/adapters/events/payment/BankAccountOpenedEventHandler';
export { OneyTrustKycDocumentGateway } from './lib/adapters/gateways/OneyTrustKycDocumentGateway';
export { ShortIdGenerator } from './lib/adapters/gateways/ShortIdGenerator';
export { ProfileMapper } from './lib/adapters/mappers/ProfileMapper';
export { OdbProfileRepositoryRead } from './lib/adapters/repositories/profile/OdbProfileRepositoryRead';
export { OdbProfileRepositoryWrite } from './lib/adapters/repositories/profile/OdbProfileRepositoryWrite';
export { ProfileGenerator } from './lib/__test__/fixtures/tips/ProfileGenerator';
export { OneyFicpGateway } from './lib/adapters/gateways/OneyFicpGateway';
export { PreEligibilityOKEventHandler } from './lib/adapters/events/cdp/PreEligibilityOKEventHandler';
export { OneyB2BContractGateway } from './lib/adapters/gateways/OneyB2BContractGateway';
