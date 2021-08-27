export type AzMessageBody = {
  [key: string]: unknown;

  domainEventProps: {
    timestamp: number;
    sentAt: string;
    id: string;
    metadata: AzMessageBodyMetadata;
  };
};

export type AzMessageBodyMetadata = {
  [key: string]: unknown;
  namespace: string;
  eventName: string;
  version: number;
};
