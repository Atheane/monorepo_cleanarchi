// import { ServiceBusClient } from '@azure/service-bus';
// import {
//   EventMessageSerializer,
//   EventMetadata,
//   TopicProviderFromEventInstance,
//   Event,
// } from '@oney/messages-core';
// import { SagaEventDispatcher } from '@oney/saga-core';
// import { injectable } from 'inversify';
//
// @injectable()
// export class AzureServiceBusEventDispatcher extends SagaEventDispatcher {
//   private _serviceBus: ServiceBusClient;
//   private _topicProvider: TopicProviderFromEventInstance;
//   private _serializer: EventMessageSerializer;
//
//   constructor(
//     serviceBus: ServiceBusClient,
//     topicProvider: TopicProviderFromEventInstance,
//     serializer: EventMessageSerializer,
//   ) {
//     super();
//     this._serviceBus = serviceBus;
//     this._topicProvider = topicProvider;
//     this._serializer = serializer;
//   }
//
//   public async dispatch(event: Event): Promise<void> {
//     const metadata = EventMetadata.getFromInstance(event);
//
//     const topics = this._topicProvider.getTopics(event);
//     for (const topic of topics) {
//       const sender = this._serviceBus.createSender(topic);
//
//       const body = this._serializer.serialize(event);
//
//       await sender.sendMessages({
//         body: body,
//         // We put the event for differenciate from other domainEvent as the id can be the same.
//         messageId: event.id,
//         subject: `${metadata.namespace}.${metadata.name}.${metadata.version}`,
//         applicationProperties: {
//           namespace: metadata.namespace,
//           name: metadata.name,
//           version: metadata.version,
//         },
//       });
//     }
//   }
// }
