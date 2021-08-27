export type EventMessageBody = {
  [key: string]: unknown;

  domainEventProps: {
    timestamp: number;
    sentAt: string;
    id: string;
    metadata: EventMessageBodyMetadata;
    createdAt?: Date;
  };
};

export type EventMessageBodyMetadata = {
  [key: string]: unknown;
  namespace: string;
  eventName: string;
  version: number;
};
