import { ReceivedMessageInfo } from '@azure/service-bus';

export class ReceivedMessageInfoMapper {
  static toLog(message: ReceivedMessageInfo) {
    return {
      messageId: message.messageId,
      label: message.label,
      partitionKey: message.partitionKey,
      userProperties: message.userProperties,
    };
  }
}
