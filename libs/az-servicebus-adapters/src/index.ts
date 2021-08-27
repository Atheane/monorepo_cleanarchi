/**
 * @packageDocumentation
 * @module az-servicebus-adapters
 */

export { createAzureConnection } from './lib/azure/build';
export { AzureEventBusReceiver } from './lib/azure/services/AzureEventBusReceiver';
export { AzureServiceBus } from './lib/azure/services/AzureServiceBus';
export { AzureEventBusDispatcher } from './lib/azure/services/AzureEventBusDispatcher';

export { configureInMemoryEventHandlerExecution } from './lib/azure/services/execution/configureInMemoryEventHandlerExecution';
export { configureMongoEventHandlerExecution } from './lib/azure/services/execution/configureMongoEventHandlerExecution';
export { IdempotentEventHandlerExecutionStrategy } from './lib/azure/services/execution/IdempotentEventHandlerExecutionStrategy';
export { DefaultEventHandlerExecutionFinder } from './lib/azure/services/execution/DefaultEventHandlerExecutionFinder';
export { DefaultEventHandlerExecutionStore } from './lib/azure/services/execution/DefaultEventHandlerExecutionStore';
export { EventHandlerExecution } from './lib/azure/services/execution/EventHandlerExecution';
export { InMemoryEventHandlerExecutionRepository } from './lib/azure/services/execution/in-memory/InMemoryEventHandlerExecutionRepository';
export { EventHandlerSubscriptionMapper } from './lib/azure/services/execution/mappers/EventHandlerSubscriptionMapper';
export { ReceivedMessageInfoMapper } from './lib/azure/services/execution/mappers/ReceivedMessageInfoMapper';
export { MongoEventHandlerExecutionRepository } from './lib/azure/services/execution/mongo/MongoEventHandlerExecutionRepository';
export {
  connectEventHandlerExecutionModel,
  EventHandlerExecutionDoc,
  EventHandlerExecutionHistoryEntryDoc,
  EventHandlerExecutionHistoryEntrySchema,
  EventHandlerExecutionSchema,
  getEventHandlerExecutionModel,
} from './lib/azure/services/execution/mongo/schemas/EventHandlerExecutionSchema';
