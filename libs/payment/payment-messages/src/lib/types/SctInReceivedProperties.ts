export type SctInReceivedProperties = {
  callback: SctInReceivedCallback;
  details: SctInReceivedDetails;
};

export type SctInReceivedCallback = {
  userid: string;
};

export interface SctInReceivedDetails {
  Amount: number;
  OrderId: string;
  AccountId: {
    AppAccountId: string;
  };
}
