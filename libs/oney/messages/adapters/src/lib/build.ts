// import { ServiceBusAdministrationClient, ServiceBusClient } from '@azure/service-bus';
// import { DefaultServiceNamespaceProvider } from '@oney/core';
// import { AzureServiceBusEventDispatcher } from './events/AzureServiceBusEventDispatcher';
// import { AzureServiceBusEventReceiver } from './events/AzureServiceBusEventReceiver';
// import { DefaultEventMessageSerializer } from './events/DefaultEventMessageSerializer';
// import { DefaultTopicProviderFromEvent } from './events/DefaultTopicProviderFromEvent';
// import { MessagingPlugin } from './MessagingPlugin';
//
// export function createAzureConnection(connectionString: string, namespace: string): MessagingPlugin {
//   const serviceBusClient = new ServiceBusClient(connectionString);
//   const serviceBusAdministrationClient = new ServiceBusAdministrationClient(connectionString);
//   const topicProvider = new DefaultTopicProviderFromEvent();
//   const serializer = new DefaultEventMessageSerializer();
//
//   const namespaceProvider = new DefaultServiceNamespaceProvider(namespace);
//
//   const azureEventBusDispatcher = new AzureServiceBusEventDispatcher(
//     serviceBusClient,
//     topicProvider,
//     serializer
//   );
//   const azureEventBusReceiver = new AzureServiceBusEventReceiver(
//     namespaceProvider,
//     serviceBusClient,
//     serviceBusAdministrationClient,
//     topicProvider,
//     serializer
//   );
//   return {
//     dispatcher: azureEventBusDispatcher,
//     receiver: azureEventBusReceiver
//   };
// }
