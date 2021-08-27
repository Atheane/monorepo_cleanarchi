export type RxMessageBody = {
  [key: string]: unknown;

  domainEventProps: {
    timestamp: number;
    sentAt: string;
    id: string;
    metadata: RxMessageBodyMetadata;
  };
};

export type RxMessageBodyMetadata = {
  [key: string]: unknown;
  namespace: string;
  eventName: string;
  version: number;
};
