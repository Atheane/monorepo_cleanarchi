export type AzMessage = {
  body: string | Buffer;
  messageId: string;
  partitionKey: string;
  label: string;
  userProperties: {
    namespace: string;
    name: string;
    version: number;
  };
};
