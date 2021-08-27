// import { JSONConvert } from '@oney/common-core';
// import { OneyExecutionContext } from '@oney/context';
// import { EventMetadata, Event, StaticEventRegistry, EventMessageBodySerializer } from '@oney/messages-core';
// import { injectable } from 'inversify';
// import { EventJson } from './EventJson';
//
// @injectable()
// export class DefaultEventMessageSerializer extends EventMessageBodySerializer {
//   serialize(event: Event, context?: OneyExecutionContext): string {
//     const metadata = EventMetadata.getFromInstance(event);
//
//     const eventJson: EventJson = {
//       id: event.id,
//       name: metadata.name,
//       timestamp: Date.now(),
//       namespace: metadata.namespace,
//       version: metadata.version,
//       context: context,
//       payload: {
//         // todo make a better method to capture the custom event properties outside of props
//         ...event,
//       },
//     };
//
//     return JSONConvert.serialize(eventJson);
//   }
//
//   public deserialize(event: string): Event {
//     const eventJson: EventJson = JSONConvert.deserialize(event);
//
//     const eventMetadata = StaticEventRegistry.get(eventJson.namespace, eventJson.name, eventJson.version);
//     if (!eventMetadata) {
//       throw new Error(
//         `Cannot deserialize ${eventJson.name}, because it not found in the ${StaticEventRegistry.name}`,
//       );
//     }
//
//     const instance = new eventMetadata.target();
//
//     // todo make a better method to capture the custom event properties outside of props
//     // it is a side effect
//     Object.assign(instance, eventJson.payload);
//
//     return instance;
//   }
// }
