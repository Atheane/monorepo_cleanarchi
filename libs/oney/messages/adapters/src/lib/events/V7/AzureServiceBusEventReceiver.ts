// import {
//   ProcessErrorArgs,
//   ServiceBusAdministrationClient,
//   ServiceBusClient,
//   ServiceBusReceivedMessage,
// } from '@azure/service-bus';
// import { ServiceNamespaceProvider } from '@oney/core';
// import { EventErrors } from '@oney/ddd';
// import {
//   EventMessageSerializer,
//   EventMetadata,
//   EventReceiverHandler,
//   TopicProviderFromEventCtor,
//   Event,
//   EventReceiver,
//   EventCtor,
// } from '@oney/messages-core';
// import { injectable } from 'inversify';
//
// @injectable()
// export class AzureServiceBusEventReceiver implements EventReceiver {
//   private _serviceBus: ServiceBusClient;
//   private _topicProvider: TopicProviderFromEventCtor;
//   private _serviceBusAdmin: ServiceBusAdministrationClient;
//   private _serializer: EventMessageSerializer;
//   private _serviceNamespaceProvider: ServiceNamespaceProvider;
//
//   constructor(
//     serviceNamespaceProvider: ServiceNamespaceProvider,
//     serviceBus: ServiceBusClient,
//     serviceBusAdmin: ServiceBusAdministrationClient,
//     topicProvider: TopicProviderFromEventCtor,
//     serializer: EventMessageSerializer,
//   ) {
//     this._serviceNamespaceProvider = serviceNamespaceProvider;
//     this._serializer = serializer;
//     this._serviceBus = serviceBus;
//     this._serviceBusAdmin = serviceBusAdmin;
//     this._topicProvider = topicProvider;
//   }
//
//   public async subscribe(event: EventCtor<Event>, handler: EventReceiverHandler) {
//     const metadata = EventMetadata.getFromCtor(event);
//
//     if (!metadata) {
//       throw new EventErrors.MissingEventAttributes(`Do not forget to set Event decorator on event: ${event.name}`);
//     }
//
//     const eventName = metadata.name;
//
//     // create a dispose wrapper to be able to dispose all associated topics in same time
//     const dispose = new EventSubscriptionDisposeWrapper();
//
//     const topics = this._topicProvider.getTopics(event);
//     for (const topic of topics) {
//       const subscriptionName = await this.ensureSubscription(topic, event, handler);
//
//       // todo select better subscription name
//       const receiver = this._serviceBus.createReceiver(topic, subscriptionName, {
//         receiveMode: 'peekLock',
//       });
//
//       const subscription = receiver.subscribe(
//         {
//           processMessage: async (message: ServiceBusReceivedMessage): Promise<void> => {
//             // todo make a try catch
//             const eventMessage = this._serializer.deserialize(message.body);
//
//             await handler.handle(eventMessage, {});
//
//             await receiver.completeMessage(message);
//           },
//           processError: (args: ProcessErrorArgs): Promise<void> => {
//             // todo make a better error processing
//             console.log(
//               `Error occurred while handling event: ${eventName}, by ${handler.identifier} error:`,
//               args.error,
//             );
//             throw new EventErrors.EventHandlerSubscriptionError(
//               `Error occurred while handling event: ${eventName}, by ${handler.identifier}`,
//             );
//           },
//         },
//         {
//           autoCompleteMessages: false,
//         },
//       );
//
//       dispose.add(subscription);
//     }
//
//     return dispose;
//   }
//
//   // get an unique subscriptionName by handler
//   private computeSubscriptionName(event: EventCtor<Event>, handler: EventReceiverHandler) {
//     const metadata = EventMetadata.getFromCtor(event);
//     const serviceNamespace = this._serviceNamespaceProvider.getNamespace();
//     return `${serviceNamespace}.${handler.identifier}->${metadata.namespace}->${metadata.name}->${metadata.version}`;
//   }
//
//   private async ensureSubscription(topic: string, event: EventCtor<Event>, handler: EventReceiverHandler) {
//     const metadata = EventMetadata.getFromCtor(event);
//
//     const subscriptionName = this.computeSubscriptionName(event, handler);
//
//     const exists = await this._serviceBusAdmin.subscriptionExists(topic, subscriptionName);
//     if (!exists) {
//       await this._serviceBusAdmin.createSubscription(topic, subscriptionName, {
//         autoDeleteOnIdle: 'PT1H',
//         defaultRuleOptions: {
//           name: 'default',
//           filter: {
//             subject: `${metadata.namespace}.${metadata.name}.${metadata.version}`,
//             applicationProperties: {
//               namespace: metadata.namespace,
//               eventName: metadata.name,
//               version: metadata.version,
//             },
//           },
//         },
//       });
//     }
//
//     return subscriptionName;
//   }
// }
//
// export type EventSubscriptionDispose = {
//   /**
//    * Causes the subscriber to stop receiving new messages.
//    */
//   close(): Promise<void>;
// };
//
// export class EventSubscriptionDisposeWrapper {
//   private _receivers: EventSubscriptionDispose[];
//
//   constructor() {
//     this._receivers = [];
//   }
//
//   add(dispose: EventSubscriptionDispose) {
//     this._receivers.push(dispose);
//   }
//
//   async close(): Promise<void> {
//     const promises = this._receivers.map(x => x.close());
//
//     await Promise.all(promises);
//   }
// }
